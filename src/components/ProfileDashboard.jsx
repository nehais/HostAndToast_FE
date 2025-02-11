import "../styles/ProfilePage.css";

import { useState } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DisplayDropDown from "./DisplayDropDown";

const ProfileDashboard = ({
  chefMeals,
  buyerMeals,
  platesServed,
  totalRevenue,
  platesBought,
  totalPurchase,
  setRefreshProfile,
}) => {
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
              <span className="badge bg-success">{platesServed}</span>
            </div>
            <div>
              💰 <strong>Revenue Generated: </strong>
              <span className="badge bg-info">{totalRevenue}€</span>
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

        <Tab
          eventKey="buyer"
          title="Customers's Dashboard"
          className="dashboard-tab"
        >
          <div className="stats">
            <div>
              🍽️ <strong>Meals Enjoyed: </strong>
              <span className="badge bg-success">{platesBought}</span>
            </div>
            <div>
              💰 <strong>Invested in Authentic Tastes: </strong>
              <span className="badge bg-info">{totalPurchase}€</span>
            </div>
          </div>

          <div className="dashboard-tab-cont">
            <DisplayDropDown
              notification={"up coming Meal Pickup"}
              mealCount={
                buyerMeals.activeOrders ? buyerMeals.activeOrders.length : 0
              }
              active={true}
              orders={buyerMeals.activeOrders}
              setRefreshProfile={setRefreshProfile}
            />

            <DisplayDropDown
              notification={"completed Meal Purchase"}
              mealCount={
                buyerMeals.expiredOrders ? buyerMeals.expiredOrders.length : 0
              }
              active={false}
              orders={buyerMeals.expiredOrders}
              hideActions={true}
            />
          </div>
        </Tab>
      </Tabs>
    </div>
  );
};

export default ProfileDashboard;
