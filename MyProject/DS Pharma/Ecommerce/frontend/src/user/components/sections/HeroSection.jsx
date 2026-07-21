import {
  MobileTitle,
  BackgroundText,
  DoctorImage,
  MascotCard,
  MobileMarquee,
  HeroAddImage,
  DecorativeStripes
} from './hero';

const ResponsiveHeroSection = () => {
  return (
    <div
      className="hero relative w-full overflow-hidden min-h-[55vh] sm:min-h-[80vh] md:min-h-screen mb-0 sm:mb-8 pb-0"
      style={{
        background: 'linear-gradient(108deg, #E6D4F1 0%, #C4EBF5 50%, #A8EEDF 100%)',
      }}
    >
      {/* Main Hero Content */}
      <div className="relative flex flex-col items-center justify-center max-w-7xl mx-auto min-h-[60vh] sm:min-h-[calc(100vh-140px)] pb-0 mt-[50px]"
      style={{ width: '100%', maxWidth: '1280px', margin: '0 auto' }}
      >
        <MobileTitle />
        <BackgroundText />
        <DoctorImage />
        <MascotCard />
      </div>

      <MobileMarquee />
      <HeroAddImage />
      <DecorativeStripes />
    </div>
  );
};

export default ResponsiveHeroSection;
