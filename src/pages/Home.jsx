import Hero from '../components/home/Hero'
import Chef from '../components/home/Chef'
import WhyChooseUs from '../components/home/WhyChooseUs'
import ServicesOverview from '../components/home/ServicesOverview'
import GalleryPreview from '../components/home/GalleryPreview'
import Testimonials from '../components/home/Testimonials'
import OrderCTA from '../components/home/OrderCTA'

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Hero />
      <Chef />
      <WhyChooseUs />
      <ServicesOverview />
      <GalleryPreview />
      <Testimonials />
      <OrderCTA />
    </main>
  )
}
