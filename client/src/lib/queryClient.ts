import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Security feature: Generate a random token to use as a CSRF token
const generateCSRFToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Store CSRF token in memory (in a real app, this would be managed by the server)
let csrfToken = generateCSRFToken();

// Function to detect common XSS patterns
const containsXSS = (input: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /eval\s*\(/gi
  ];
  
  return xssPatterns.some(pattern => pattern.test(input));
};

// Function to sanitize inputs before sending to API
const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    // Replace potentially dangerous characters
    return data
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  if (typeof data === 'object' && data !== null) {
    if (Array.isArray(data)) {
      return data.map(item => sanitizeInput(item));
    }
    
    const sanitizedObj: Record<string, any> = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        sanitizedObj[key] = sanitizeInput(data[key]);
      }
    }
    return sanitizedObj;
  }
  
  return data;
};

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Check for XSS in the URL
  if (typeof url === 'string' && containsXSS(url)) {
    throw new Error('Potential security issue detected in URL');
  }
  
  // Security feature: Sanitize the body data
  let sanitizedData = data;
  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    sanitizedData = sanitizeInput(data);
  }
  
  const res = await fetch(url, {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      // Security feature: Add CSRF token to all non-GET requests
      ...(method !== 'GET' ? { "X-CSRF-Token": csrfToken } : {}),
    },
    body: sanitizedData ? JSON.stringify(sanitizedData) : undefined,
    credentials: "same-origin", // Security feature: Send cookies only to same origin
  });

  // Security feature: Update CSRF token if provided in response
  const newCsrfToken = res.headers.get('X-CSRF-Token');
  if (newCsrfToken) {
    csrfToken = newCsrfToken;
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    
    // Check for XSS in the URL
    if (containsXSS(url)) {
      throw new Error('Potential security issue detected in URL');
    }
    
    const res = await fetch(url, {
      credentials: "same-origin",
      headers: {
        // Adding security headers for GET requests too
        "X-Requested-With": "XMLHttpRequest" // Helps prevent CSRF
      }
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
