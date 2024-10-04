export default function UserType(){
    return (
        <>
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl">Join as a client or Freelancer</h1>
            <div className="grid grid-cols-2 gap-4">
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">I am a Freelancer, looking for work.</h2>
                        <div className="card-actions justify-center">
                            <button className="btn btn-primary">Join</button>
                        </div>
                    </div>
                </div>
                <div className="card bg-base-100 w-96 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">I am a Client, hiring for a project.</h2>
                        <div className="card-actions justify-center">
                            <button className="btn btn-primary">Join</button>
                        </div>
                    </div>
                </div>
            </div>
            <h1 className="text-2xl">Already have an account? <a href="">Login</a></h1>
        </div>
        </>
    )
}