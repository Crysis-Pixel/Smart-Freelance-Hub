import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import UserType from "../components/usertype.jsx";

import React, { useState, useEffect } from "react";

export default function Profile() {
  return (
    <>
      <Header />
      <div id="dashboard" className="container mx-auto border my-32">
        <div
          id="profile-container"
          className="flex gap-10 items-center md:p-10 p-2"
        >
          <div className="avatar">
            <div className="w-24 rounded-full">
              <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <div className="flex-grow">
            <h1 className="text-xl">NAME</h1>
            <p>Country</p>
          </div>
          <button className="btn ml-auto">EDIT</button>
        </div>

        <hr />

        <div id="body-container" className="flex">
          <div id="stats-container" className="border-r-2">
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
            <div className="flex flex-col gap-10 p-10">
              <div>
                <h1 className="font-bold">Hours Per Week</h1>
                <p>10hr/week</p>
              </div>

              <div>
                <h1 className="font-bold">Languages</h1>
                <p>English</p>
              </div>

              <div>
                <h1 className="font-bold">Skills</h1>
                <p>Web dev</p>
              </div>
            </div>
          </div>

          <div>
            <div id="bio-container" className=" px-10 py-5">
              <div id="bio-title" className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Profile Bio</h1>
                </div>
                <div>
                  <h2 className="text-xl font-bold">$$$/hr</h2>
                </div>
              </div>

              <div>
                <h1>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatem soluta itaque suscipit consequuntur fuga quae
                  aliquam nam quos dicta, natus ad asperiores eum excepturi vel
                  facilis maiores expedita. Cum, here!
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
