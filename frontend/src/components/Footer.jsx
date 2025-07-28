const FooterMultiColumn = () => (
  <footer className="bg-gray-900 text-gray-300 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-semibold mb-4">About Us</h3>
        <p className="text-sm">We deliver quality clothing with style and passion.</p>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Shop</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:underline">Men's</a></li>
          <li><a href="#" className="hover:underline">Women's</a></li>
          <li><a href="#" className="hover:underline">Accessories</a></li>
          <li><a href="#" className="hover:underline">Sale</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Support</h3>
        <ul className="space-y-2 text-sm">
          <li><a href="#" className="hover:underline">Contact</a></li>
          <li><a href="#" className="hover:underline">FAQs</a></li>
          <li><a href="#" className="hover:underline">Shipping</a></li>
          <li><a href="#" className="hover:underline">Returns</a></li>
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-4">Follow Us</h3>
        <div className="flex space-x-4 text-lg">
          <a href="#" className="hover:text-white">FB</a>
          <a href="#" className="hover:text-white">TW</a>
          <a href="#" className="hover:text-white">IG</a>
        </div>
      </div>
    </div>
    <div className="mt-8 text-center text-sm">
      &copy; {new Date().getFullYear()} Your Brand. All rights reserved.
    </div>
  </footer>
);

export default FooterMultiColumn;
