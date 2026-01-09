"use client"
import Navbar from "@/components/Navbar";
import Landing from "./(nondashboard)/landing/page";
import { useEffect } from "react";

export default function Home() {
  useEffect(()=> {
    window.scrollTo(0,0);
  },[])
return (
    <div className="h-full w-full">
      <Navbar />
      <main className={`h-full flex w-full flex-col`}>
        <Landing />
      </main>
    </div>
  );
}
