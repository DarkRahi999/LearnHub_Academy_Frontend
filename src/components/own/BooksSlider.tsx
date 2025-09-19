// import React, { useEffect } from "react";
// import useEmblaCarousel from "embla-carousel-react";
// import Autoplay from "embla-carousel-autoplay";
// import Image from "next/image";

// export default function BooksSlider() {
//   const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

//   useEffect(() => {
//     if (emblaApi) {
//       console.log(emblaApi.slideNodes()); // Access API
//     }
//   }, [emblaApi]);

//   const bookItems = [
//     {
//       id: 1,
//       image: "/img/books/biology.jpg",
//       name: "Biology",
//     },
//     {
//       id: 2,
//       image: "/img/books/biology.jpg",
//       name: "Biology",
//     },
//     {
//       id: 3,
//       image: "/img/books/biology.jpg",
//       name: "Biology",
//     },
//     {
//       id: 4,
//       image: "/img/books/biology.jpg",
//       name: "Biology",
//     },
//   ];

//   return (
//     <div className="embla" ref={emblaRef}>
//       <div className="embla__container">
//         {bookItems.map((book, idx) => {
//           return <div key={idx} className="embla__slide">
//             <Image src={book.image} alt={book.name} width={200} height={300} />
//             <h2>{book.name}</h2>
//           </div>
//         })}
//       </div>
//     </div>
//   );
// }
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import BookSellCard from "./BookSellCard";

const BooksSlider = () => {
  const bookItemsN = [
    {
      id: 1,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/biology.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
    {
      id: 2,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/chaymistry.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
    {
      id: 3,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/Chemistry_1st.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
    {
      id: 4,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/English_1st_Paper.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
    {
      id: 5,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/Information.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
    {
      id: 6,
      title: "Name",
      author: "Rokon",
      price: 12.99,
      rating: 4.7,
      img: "/img/books/Physics_2nd_Paper.jpg",
      description:
        "Tiny changes. Remarkable results. This practical guide teaches you how to form good habits and break bad ones.",
      tags: ["Self-help", "Habits", "Bestseller"],
    },
  ];

  return (
    <div>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {bookItemsN.map((book: any, idx) => {
            return (
              <CarouselItem
                key={idx}
                className="md:basis-1/1 lg:basis-1/2 flex flex-col justify-center items-center"
              >
                <BookSellCard
                  book={book}
                  onBuy={(b) => console.log("buy", b)}
                  onWishlist={(b) => console.log("wishlist", b)}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        {/* <CarouselPrevious />
        <CarouselNext /> */}
      </Carousel>
    </div>
  );
};

export default BooksSlider;
