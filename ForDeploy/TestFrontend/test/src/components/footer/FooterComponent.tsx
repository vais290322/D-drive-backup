const FooterComponent = () => {
  return (
    <footer className="border-t bg-background px-6 py-3 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} MyApp · All rights reserved
    </footer>
  );
};

export default FooterComponent;