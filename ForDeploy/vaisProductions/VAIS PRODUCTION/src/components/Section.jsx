const Section = ({ id, className = "", children }) => {
  return (
    <section
      id={id}
      className={`mt-[100px] px-6 md:px-12 lg:px-20 mx-auto ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;
