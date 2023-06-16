import axios from "axios";

// Users

export const getUser = async (userId) => {
  await axios.get(`/users/${userId}`);
};

/* 
getUser(username)





// Plans

getAllPlans()

getPlan(planId)




// Events

createEvent(inviter, invitee)

getEvent(hash)

getOpenEvents(userId) search open status event for userid and returns the whole event




// Selections

addSelection(eventId, userId, planId)


*/
