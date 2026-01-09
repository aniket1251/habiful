"use client"

import React, { useState } from 'react'
import Image from 'next/image';
import {motion} from "framer-motion"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setFilters } from '@/state';
import { useAppSelector } from '@/state/redux';

const HeroSection = () => {
    const dispatch = useDispatch();
    const [searchQuery, setSearchQuery] = useState("");
    const filters = useAppSelector((state)=> state.global.filters);
    const router = useRouter();

    const handleLocationSearch = async () => {
        try {
        const trimmedQuery = searchQuery.trim();
        if (!trimmedQuery) return;

        const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            trimmedQuery
            )}.json?access_token=${
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            }&fuzzyMatch=true`
        );
        const data = await response.json();
        if (data.features && data.features.length > 0) {
            if(data.features && data.features.length > 0){
                    const center = data.features[0].center;
                    const coordinates: [number, number] = [
                    Number(center[0]),
                    Number(center[1]),
            ];
                    const newFilters = {...filters,
                    location: trimmedQuery,
                    coordinates };
                    dispatch(setFilters(newFilters));
            const params = new URLSearchParams({
            location: trimmedQuery,
            lat: coordinates[0].toString(),
            lng: coordinates[1].toString(),
            });
            router.push(`/search?${params.toString()}`);
        }}
        } catch (error) {
        console.error("error search location:", error);
        }
    };

  return (
    <div className='relative h-screen'>
        <Image
        src="/landing-splash.jpg"
        alt='Rentiful Rental Platform Hero Section'
        fill
        className='object-cover object-center'
        priority
        />
         <div className='absolute inset-0 bg-black/60'>
        <motion.div
        initial={{opacity:0, y:20}}
        animate={{opacity:1, y:0}}
        transition={{duration:0.8}}
        className='absolute top-1/3 transform-translate-x-1/2 -translate-y-1/2 text-center w-full'
        >
            <div className='max-w-4xl mx-auto mt-60 px-16 sm:px-12'>
                <h1 className='text-5xl font-bold text-white mb-4'>
                    Find a place that fits the way you live today
                </h1>
                <p className='text-xl text-white mb-8'>
                    Explore thoughtfully curated rental homes designed to match your lifestyle, location, and everyday needs.
                </p>
                <div className='flex justify-center'>
                    <Input
                        type='text'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder='Search by city, neighborhood, or address'
                        className='w-full max-w-lg rounded-none rounded-l-xl border-none bg-white h-12'
                    />
                    <Button
                        onClick={handleLocationSearch}
                        className='bg-secondary-600 text-white rounded-none rounded-r-xl border-none hover:bg-secondary-500 h-12'
                    >
                        Search
                    </Button>
                </div>
            </div>
        </motion.div>
        </div> 
    </div>
  )
}

export default HeroSection