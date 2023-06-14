import React from "react";
import { useState, useEffect, useRef } from "react";
import api from "../services/data.js";

export default function Match() {
  const scrollReference = useRef(null);
  const [plan, setPlan] = useState({});

  const planID = 1;

  useEffect(() => {
    const fetchData = async () => {
      const plan = await api.getPlan(planID);
      setPlan(plan);
    };
    fetchData();
  }, []);

  // console.log(plan);
  // console.log(plan.longDescription);

  // function to scroll the page down to the map
  function readMore() {
    executeScroll();
  }

  const executeScroll = () =>
    scrollReference.current.scrollIntoView({
      inline: "center",
      behavior: "smooth",
      alignToTop: false,
      block: "nearest",
    });

  return (
    <div>
      <div>
        <h1>It's a Date!</h1>

        <div className="featured-date">
          <div className="image-card">
            <img className="match-image" src={plan.imageSrc} />
          </div>

          <div className="featured-text">
            <h2>You both chose: {plan.name}</h2>
            <p className="match-longDesc">{plan.longDescription}</p>
          </div>
        </div>

        <button onClick={readMore}>Read more</button>
      </div>

      <div ref={scrollReference}>
        {plan.keyword ? (
          <div>
            <h2>Check out some useful places for your date</h2>
            {/* <div>  ////  MAP   ////   </div> */}
          </div>
        ) : null}
      </div>
    </div>
  );
}