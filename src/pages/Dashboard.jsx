import { useState } from "react";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import CategoryChart from "../components/CategoryChart";
import { leedData } from "../data";

export default function Dashboard() {
  const categories = [...new Set(leedData.map(d => d.category))];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  const filteredData = leedData.filter(d => d.category === selectedCategory);

  return (
    <div>
      <Navbar categories={categories} onSelect={setSelectedCategory} />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">{selectedCategory}</h1>
        <CategoryChart data={filteredData} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {filteredData.map((item, idx) => <Card key={idx} item={item} />)}
        </div>
      </div>
    </div>
  );
}
