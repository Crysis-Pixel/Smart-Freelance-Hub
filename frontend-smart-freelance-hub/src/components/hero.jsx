export default function Hero(){
    return (
        <>
            <div className="hero bg-base-200 min-h-screen border">
                <div className="hero-content flex-col lg:flex-row-reverse drop-shadow-sm border">
                    <img
                    src="https://via.placeholder.com/800"
                    className="w-6/12 rounded-lg shadow-2xl" />
                    <div>
                    <h1 className="text-5xl font-bold">Header</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                        quasi. In deleniti eaque aut repudiandae et a id nisi.
                    </p>
                    <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>
        </>
    );
}