const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-4 mt-8">
      <p>© {new Date().getFullYear()} Period Tracker. All rights reserved.</p>
      <div className="mt-2 space-x-4">
        <a href="/privacy-policy" className="hover:underline">
          Privacy Policy
        </a>
        <a href="/terms-of-service" className="hover:underline">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};

export default Footer;
