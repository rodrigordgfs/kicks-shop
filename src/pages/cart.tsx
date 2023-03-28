import { CartList } from "@/components/Cart/CarList";
import { OrderSummary } from "@/components/Cart/OrderSummary";
import { PageBanner } from "@/components/PageBanner";
import { CartContext } from "@/contexts/Cart";
import { CategoriesContext } from "@/contexts/Categories";
import { ICategorie } from "@/interfaces/ICategories";
import {
  CartContainer,
  CartEmptyCTA,
  CartEmptyContainer,
  CartEmptyImage,
} from "@/styles/pages/Cart";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import EmptyCart from "@/assets/emptyCart.svg";
import { useRouter } from "next/router";

interface CartProps {
  categories: ICategorie[];
}

export default function Cart({ categories }: CartProps) {
  const { handleUpdateCategories } = useContext(CategoriesContext);
  const { cart } = useContext(CartContext);

  const router = useRouter();

  useEffect(() => {
    handleUpdateCategories(categories);
  }, [categories, handleUpdateCategories]);

  return (
    <>
      <Head>
        <title>Kick Shop - Cart</title>
        <meta name="description" content="Kicks Shop - Cart" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageBanner>
        <h3>Cart</h3>
        <div>
          <span>Inicio</span> | <span>Cart</span>
        </div>
      </PageBanner>
      <CartContainer>
        {cart.length > 0 ? (
          <>
            <CartList />
            <OrderSummary />
          </>
        ) : (
          <CartEmptyContainer>
            <h2>Seu carrinho está vazio</h2>
            <CartEmptyCTA onClick={() => router.push("/products")}>
              Veja alguns de nossos produtos
            </CartEmptyCTA>
            <CartEmptyImage src={EmptyCart} alt="" />
          </CartEmptyContainer>
        )}
      </CartContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const categorieResponse = await fetch(
    "https://fakestoreapi.com/products/categories"
  );
  const categorieData = await categorieResponse.json();

  const categories = categorieData.map((category: string) => {
    return {
      id: uuidv4(),
      name: category,
    };
  }) as ICategorie[];

  return {
    props: {
      categories,
    },
    revalidate: 60 * 60 * 2,
  };
};
