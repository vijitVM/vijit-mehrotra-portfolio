import { motion } from "framer-motion";

const SkeletonPiece = ({ className }: { className: string }) => (
    <div className={`bg-gray-700/50 rounded ${className} animate-pulse`}></div>
);

export const PitchSkeleton = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-5 bg-gray-800/70 rounded-lg border border-gray-700 space-y-5"
        >
            {/* Mimics "Project Proposal: ..." heading */}
            <SkeletonPiece className="h-7 w-3/4" />

            {/* Mimics "Problem Analysis" subheading */}
            <SkeletonPiece className="h-5 w-1/3 pt-4" />
            
            {/* Mimics a paragraph */}
            <div className="space-y-2">
                <SkeletonPiece className="h-4 w-full" />
                <SkeletonPiece className="h-4 w-5/6" />
            </div>

            {/* Mimics "Proposed Solution" subheading */}
            <SkeletonPiece className="h-5 w-1/2 pt-4" />

            {/* Mimics another paragraph */}
            <div className="space-y-2">
                <SkeletonPiece className="h-4 w-full" />
                <SkeletonPiece className="h-4 w-full" />
                <SkeletonPiece className="h-4 w-4/6" />
            </div>

             {/* Mimics "Key Features" list */}
             <SkeletonPiece className="h-5 w-1/4 pt-4" />
             <div className="space-y-2 pl-5">
                <SkeletonPiece className="h-4 w-11/12" />
                <SkeletonPiece className="h-4 w-10/12" />
             </div>
        </motion.div>
    );
};

export default PitchSkeleton;