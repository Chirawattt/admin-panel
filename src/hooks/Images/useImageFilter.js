import { useState, useMemo } from "react";

/**
 * Custom hook สำหรับจัดการการเรียงลำดับรูปภาพ
 */
export const useImageFilter = (images) => {
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeFilters, setActiveFilters] = useState(0);

  // Update active filters count
  useMemo(() => {
    let count = 0;
    if (sortOrder !== "newest") count++;
    setActiveFilters(count);
  }, [sortOrder]);

  // Reset all filters
  const resetFilters = () => {
    setSortOrder("newest");
  };

  // Sort the images based on the current sort order
  const filteredImages = useMemo(() => {
    if (!images || !images.length) return [];

    let filtered = [...images];

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [images, sortOrder]);

  return {
    sortOrder,
    setSortOrder,
    filteredImages,
    resetFilters,
    activeFilters,
  };
};

export default useImageFilter;
