import Header from '../components/header.jsx'
import Hero from '../components/hero.jsx'
import Footer from '../components/footer.jsx'

export default function Home(){
    return (
        <>
          <Header profilePicture={
          JSON.parse(sessionStorage.getItem("user")).profilePicture
        }/>
          <Hero/>
          <Footer/>
        </>
      );
}

