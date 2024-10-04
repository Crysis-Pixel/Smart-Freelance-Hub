import Header from '../components/header.jsx'

export default function Profile(){

    return (
        <>
        <Header/>
        <div id="dashboard-container" className="container mx-auto border ">
            <div id="profile-container" className="flex gap-10 items-center">
                <div className="avatar">
                    <div className="w-24 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                    </div>
                </div>
                <div className="flex-grow">
                    <h1 className='text-xl'>NAME</h1>
                    <p>Country</p>
                </div>
                <button className='btn ml-auto'>EDIT</button>
            </div>

            <hr />
            
            <div id='body-container' className='flex '>
                <div id='stats-container'>
                    <div className="stats stats-vertical lg:stats-horizontal shadow">
                        <div className="stat">
                            <div className="stat-title">Total Earnings</div>
                            <div className="stat-value">31K</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Total Jobs</div>
                            <div className="stat-value">400</div>
                        </div>

                        <div className="stat">
                            <div className="stat-title">Total Hours</div>
                            <div className="stat-value">1,200</div>
                            <div className="stat-desc">↘︎ 90 (14%)</div>
                        </div>
                    </div>
                    <div>
                        <h1 className=''>Hours Per Week</h1>
                        <p>10hr/week</p>

                        <h1>Languages</h1>
                        <p>English</p>

                        <h1>Skills</h1>
                        <p>Web dev</p>
                    </div>
                </div>
                
                <div>
                    <div id='bio-container'>
                        <div id='bio-title' className='flex'>
                            <h1 className='text-2xl'>Profile Bio</h1>
                            <h2 className='text-xl'>$$$/hr</h2>
                        </div>

                        <div>
                            <h1>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem soluta itaque suscipit consequuntur fuga quae aliquam nam quos dicta, natus ad asperiores eum excepturi vel facilis maiores expedita. Cum, rem!</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}