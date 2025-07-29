import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Jaya Rice',
    description: 'Premium quality rice varieties and grains from around the world',
    image: '/jaya.jpg',
    slug: 'grains-rice',
  },
  {
    id: 2,
    name: 'Jaggery',
    description: 'Pure and natural jaggery blocks, rich in taste and nutrients',
    image: '/jaggery.jpg',
    slug: 'grains-rice',
  },
  {
    id: 3,
    name: 'Coconut Oil',
    description: 'Pure Kerala coconut oil for cooking, rich in aroma and nutrition',
    image: '/oil.jpg',
    slug: 'grains-rice',
  },
  {
    id: 4,
    name: 'Matta Unda Rice',
    description: 'Traditional Kerala red rice, wholesome and full of fiber',
    image: '/matta.jpg',
    slug: 'grains-rice',
  },
  {
    id: 5,
    name: 'Vadi Matta Rice',
    description: 'Soft-textured Kerala rice with rich aroma and nutrition',
    image: '/vadi.jpg',
    slug: 'grains-rice',
  },
];

const ProductCategories = () => {
  return (
    <section className="py-16 bg-[#F8FAFC] font-sans">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-[#1E293B] mb-4">
            Our Product Categories
          </h2>
          <p className="text-[#1E293B] text-lg">
            We offer a wide range of high-quality food products to meet diverse consumer needs across global markets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg overflow-hidden shadow-md transform hover:scale-[1.03] hover:shadow-xl transition duration-500 group"
            >
              {/* Image Section */}
              <div className="pt-6 px-6">
                <div className="h-56 flex items-center justify-center p-4 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="max-h-52 object-contain rounded-xl transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#1E293B] font-heading group-hover:text-[#2563EB] transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-[#475569]">{category.description}</p>
                </div>

                {/* Button */}
                <Link
                  to={`/products#${category.slug}`}
                  className="inline-flex items-center text-[#2563EB] font-medium hover:text-[#1E40AF] transition-colors"
                >
                  View Products
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#2563EB] text-white font-heading rounded-md hover:bg-[#1E40AF] transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
