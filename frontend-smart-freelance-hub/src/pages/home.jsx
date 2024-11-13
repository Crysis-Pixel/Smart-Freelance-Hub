import Header from '../components/header.jsx'
import Hero from '../components/hero.jsx'
import Footer from '../components/footer.jsx'

export default function Home() {
  const user = sessionStorage.getItem("user") 
    ? JSON.parse(sessionStorage.getItem("user")) 
    : {};

  return (
    <>
      <Header profilePicture={user.profilePicture || ""} />
      <Hero />
      <Footer />
    </>
  );
}


