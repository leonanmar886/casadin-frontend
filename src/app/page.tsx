import BestManPhoto from "@/components/BestManPhoto";
import Button from "@/components/Button";
import CardMarriage from "@/components/CardMarriage";
import FianceBanner from '@/components/FianceBanner';
import FiancePhoto from "@/components/FiancePhoto";
import Form from '@/components/Form';
import Product from '@/components/Product';
import airfryerImage from '../assets/airfryer.png';

export default function Home() {

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <FianceBanner></FianceBanner>
        <Button text="Entrar"></Button>
        <Form text="E-mail"/>
        <FiancePhoto text="Noivo 1"></FiancePhoto>
        <BestManPhoto text="Padrinho"></BestManPhoto>
        <CardMarriage text="Noivo&Noivo"></CardMarriage>

        <Product
          id={1}
          name="Air Fryer"
          price={299.90}
          image={airfryerImage}
        />
      </main>
    </div>
  );

}
