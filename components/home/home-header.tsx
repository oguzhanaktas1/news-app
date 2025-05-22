'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { Popover, Transition } from '@headlessui/react';
import { Menu, X } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { categoryNames } from '@/lib/categories';

interface NewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
}

export function HomeHeader() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      setError(null);
      return;
    }

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(async () => {
      setError(null);
      try {
        const res = await fetch(
          `/api/news/search?query=${encodeURIComponent(searchTerm)}&page=1&pageSize=5`
        );
        if (!res.ok) throw new Error('Failed to fetch suggestions');

        const data = await res.json();
        const articles = data.articles || [];

        const mapped = articles.map((item: any) => ({
          id: item.id || item.url || Math.random().toString(),
          title: item.title,
          description: item.description || item.summary || item.content || '',
          url: item.url,
          imageUrl: item.urlToImage || item.image || '',
        }));

        setSuggestions(mapped);
      } catch (err) {
        setError((err as Error).message);
      }
    }, 300);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchTerm.trim().length > 0) {
      router.push(`/news/search?query=${encodeURIComponent(searchTerm.trim())}`);
      setSuggestions([]);
      setSearchTerm('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background dark:bg-background-dark">
      <div className="mx-auto flex h-16 items-center justify-between px-4 md:px-[10%] lg:px-[15%]">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/home" className="text-xl font-bold text-foreground dark:text-foreground-dark">
            OA News
          </Link>
        </div>

        {/* Navigation - desktop */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/news/all" passHref legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    All News
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-2 w-[400px] md:w-[500px] lg:w-[600px]">
                    {Object.entries(categoryNames).map(([categoryId, name]) => (
                      <li key={categoryId}>
                        <Link href={`/news/category/${categoryId}`} passHref legacyBehavior>
                          <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">{name}</div>
                            <p className="line-clamp-2 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                              Latest news in the {name} category
                            </p>
                          </NavigationMenuLink>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/newsassistant" passHref legacyBehavior>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    AI Assistant
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Search - visible on md+ */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex items-center space-x-2"
            autoComplete="off"
          >
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            <Button type="submit" size="sm" variant="outline">Search</Button>

            {searchTerm.trim() !== '' && (
              <div className="absolute top-full left-0 right-0 z-50 max-h-72 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg mt-1 dark:border-gray-700 dark:bg-gray-900">
                {error && <p className="p-2 text-red-600 dark:text-red-400">Error: {error}</p>}
                {!error && suggestions.length === 0 && (
                  <p className="p-2 text-gray-500 dark:text-gray-400">No suggestions</p>
                )}
                <ul>
                  {suggestions.map(({ id, title, description, url, imageUrl }) => (
                    <li
                      key={id}
                      className="flex cursor-pointer items-center gap-3 border-b border-gray-200 p-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
                      onClick={() => window.open(url, "_blank")}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-16 h-10 object-cover rounded"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      ) : (
                        <div className="w-16 h-10 rounded bg-gray-200 dark:bg-gray-700" />
                      )}
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate font-semibold text-blue-600 dark:text-blue-400">{title}</span>
                        <span className="line-clamp-2 max-w-[300px] text-xs text-gray-600 dark:text-gray-400">{description}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>

          {/* Mode toggle */}
          <ModeToggle />

          {/* Auth buttons - md+ */}
          <div className="hidden sm:flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth/login">Log In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden">
            <Popover>
              {({ open }) => (
                <>
                  <Popover.Button className="p-2 focus:outline-none">
                    {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </Popover.Button>
                  <Transition
                    enter="transition duration-200 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-100 ease-in"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Popover.Panel className="absolute right-4 top-16 z-50 w-64 origin-top-right rounded-md bg-white dark:bg-gray-900 p-4 space-y-4 border dark:border-gray-700">
                      <Link href="/news/all" className="block text-sm font-medium hover:text-blue-500">All News</Link>
                      <div>
                        <span className="text-xs text-gray-400 dark:text-gray-500">Categories</span>
                        <div className="mt-2 flex flex-col gap-1">
                          {Object.entries(categoryNames).map(([id, name]) => (
                            <Link key={id} href={`/news/category/${id}`} className="text-sm hover:text-blue-500">{name}</Link>
                          ))}
                        </div>
                      </div>
                      <Link href="/newsassistant" className="block text-sm font-medium hover:text-blue-500">AI Assistant</Link>
                      <Link href="/auth/login" className="block text-sm hover:text-blue-500">Log In</Link>
                      <Link href="/auth/signup" className="block text-sm hover:text-blue-500">Sign Up</Link>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}
