"use client";
import React from "react";
import Form from '@/components/Form';
import FiancePhoto from "@/components/FiancePhoto";
import Button from "@/components/Button";
import BestManPhoto from "@/components/BestManPhoto";
import CardMarriage from "@/components/CardMarriage";

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button text="Entrar"></Button>
        <Form text="E-mail"/>
        <FiancePhoto text="Noivo 1"></FiancePhoto>
        <BestManPhoto text="Padrinho"></BestManPhoto>
        <CardMarriage text="Noivo&Noivo"></CardMarriage>
      </main>
    </div>
  );

}
