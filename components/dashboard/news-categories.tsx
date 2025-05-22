"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { saveUserPreferences } from "@/lib/firebaseHelpers";

const categories = [
  { id: "sports", label: "Sports" },
  { id: "economy", label: "Economy" },
  { id: "technology", label: "Technology" },
  { id: "politics", label: "Politics" },
  { id: "health", label: "Health" },
  { id: "education", label: "Education" },
  { id: "culture", label: "Culture & Arts" },
  { id: "science", label: "Science" },
];

interface NewsCategoriesProps {
  selected: string[];
  onChange: (updated: string[]) => void;
  onSave: () => void;
}

export function NewsCategories({ selected, onChange, onSave }: NewsCategoriesProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(selected);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  function toggleCategory(categoryId: string) {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  }

  useEffect(() => {
    onChange(selectedCategories);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  async function savePreferences() {
    setIsLoading(true);
    try {
      // ✅ Firebase'e kategorileri kaydet
      await saveUserPreferences({ categories: selectedCategories });

      toast({
        title: "Preferences saved",
        description: "Your news category preferences have been updated successfully.",
      });

      onSave();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to save preferences",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-card rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Your Interests</h2>
        <Button type="button" onClick={savePreferences} disabled={isLoading} size="sm">
          {isLoading ? (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" /> Saving...
            </span>
          ) : (
            "Save"
          )}
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center space-y-2 min-w-[80px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={() => toggleCategory(category.id)}
                  className="h-5 w-5"
                />
              </div>
              <Label htmlFor={category.id} className="cursor-pointer text-sm">
                {category.label}
              </Label>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
