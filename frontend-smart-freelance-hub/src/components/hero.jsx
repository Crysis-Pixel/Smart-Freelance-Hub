import home_page from "../assets/home_page.jpg";
export default function Hero() {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen border">
        <div className="hero-content flex-col lg:flex-row-reverse drop-shadow-sm border">
          <img src={home_page} className="w-6/12 rounded-lg shadow-2xl" />
          <div>
            <h1 className="text-5xl font-bold">Smart Freelance Hub</h1>
            <h2 className="font-bold">Connect with Talent, Hire with Ease.</h2>
            <p className="py-6">
              Discover top freelance professionals across industries and scale
              your projects effortlessly. Whether you’re looking to hire or
              seeking new opportunities, Smart Freelance Hub connects talent
              with innovative businesses for seamless collaboration.
            </p>
            {/* <button className="btn btn-primary">Get Started</button> */}
          </div>
        </div>
      </div>
    </>
  );
}
