import Header from "../components/header.jsx";
import Footer from "../components/footer.jsx";
import UserType from "../components/usertype.jsx";

import React, { useState, useEffect } from "react";

export default function ClientProfile() {
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
            <h1 className="text-xl">Client Name</h1>
            <p>Client Country</p>
          </div>
          <button className="btn ml-auto">EDIT</button>
        </div>

        <hr />

        <div id="body-container" className="flex">
          <div id="stats-container" className="border-r-2">
            <div className="stats stats-vertical lg:stats-horizontal shadow">
              <div className="stat">
                <div className="stat-title">Total Spending</div>
                <div className="stat-value">$50,000</div>
              </div>

              <div className="stat">
                <div className="stat-title">Total Projects Posted</div>
                <div className="stat-value">35</div>
              </div>

              <div className="stat">
                <div className="stat-title">Client Rating</div>
                <div className="stat-value">4.8</div>
                <div className="stat-desc">★★★★★</div>
              </div>
            </div>
            <div className="flex flex-col gap-10 p-10">
              <div>
                <h1 className="font-bold">Projects in Progress</h1>
                <p>5 active projects</p>
              </div>

              <div>
                <h1 className="font-bold">Preferred Skills</h1>
                <p>Graphic Design, Web Development</p>
              </div>

              <div>
                <h1 className="font-bold">Language Preference</h1>
                <p>English</p>
              </div>
            </div>
          </div>

          <div>
            <div id="bio-container" className="px-10 py-5">
              <div id="bio-title" className="flex justify-between">
                <div>
                  <h1 className="text-2xl font-bold">Client Bio</h1>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Budget: $$ - $$$</h2>
                </div>
              </div>

              <div>
                <h1>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsa
                  distinctio nostrum ex hic beatae, repellat quisquam, voluptate
                  impedit totam aliquid tempora voluptatum necessitatibus
                  obcaecati tenetur commodi suscipit dolores excepturi omnis?
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
