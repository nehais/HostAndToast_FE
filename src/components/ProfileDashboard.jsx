import "../styles/ProfilePage.css";

import { useState } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DisplayDropDown from "./DisplayDropDown";

const ProfileDashboard = ({ chefMeals, buyerMeals }) => {
  const [key, setKey] = useState("chef");
  return (
    <div className="dashboard">
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
      >
        <Tab eventKey="chef" title="Chef's Dashboard" className="dashboard-tab">
          <div className="stats">
            <div>
              🍽️ <strong>Meals Served: </strong>
              <span className="badge bg-success">{40}</span>
            </div>
            <div>
              💰 <strong>Revenue Generated: </strong>
              <span className="badge bg-info">{40}€</span>
            </div>
          </div>

          <div className="dashboard-tab-cont">
            <DisplayDropDown
              notification={"up coming Meals"}
              mealCount={
                chefMeals.activeMeals ? chefMeals.activeMeals.length : 0
              }
              active={true}
              meals={chefMeals.activeMeals}
            />

            <DisplayDropDown
              notification={"Inactive Meals"}
              mealCount={
                chefMeals.expiredMeals ? chefMeals.expiredMeals.length : 0
              }
              active={false}
              meals={chefMeals.expiredMeals}
            />
          </div>
        </Tab>

        <Tab eventKey="buyer" title="Buyers's Dashboard">
          <div className="stats">
            <div>
              🍽️ <strong>Plates Enjoyed: </strong>
              <span className="badge bg-success">{40}</span>
            </div>
            <div>
              💰 <strong>Invested in Authentic Tastes: </strong>
              <span className="badge bg-info">{40}€</span>
            </div>
          </div>

          <div className="dashboard-tab-cont">
            <DisplayDropDown
              notification={"up coming Meals"}
              mealCount={
                buyerMeals.activeMeals ? buyerMeals.activeMeals.length : 0
              }
              active={true}
              meals={buyerMeals.activeMeals}
            />

            <DisplayDropDown
              notification={"Inactive Meals"}
              mealCount={
                buyerMeals.expiredMeals ? buyerMeals.expiredMeals.length : 0
              }
              active={false}
              meals={buyerMeals.expiredMeals}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfileDashboard;
