const express = require("express");
const router = express.Router();
const models = require("../models");
const { Sequelize } = require("sequelize");
// const eventShouldBelongToUser = require("../guards/eventShouldBelongToUser");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
const notifications = require("../utils/notifications");
// ADD GUARDS
// user should be logged in
// user should exist
// plan must exist
// event must exist
// event should belong to user

// POST a selection
router.post("/", userShouldBeLoggedIn, async function (req, res, next) {
  const { eventId, planId } = req.body;
  const userId = req.user_id;

  const selection = await models.Selection.findOne({
    where: {
      userId,
      planId,
      eventId,
    },
  });
  console.log("hello");
  // if there is already a selection with this values
  if (selection) {
    // delete it
    await models.Selection.destroy({
      where: {
        userId,
        planId,
        eventId,
      },
    });
    res.send("Selection deleted.");
  } else {
    // start creating a new selection
    try {
      // Create a new selection
      await models.Selection.create({
        userId,
        planId,
        eventId,
      });

      // Find one selection
      const match = await models.Selection.findOne({
        // With these values
        where: {
          userId,
          planId,
          eventId,
        },
      });

      // If it exists
      if (match) {
        // Find the other selection
        const otherMatch = await models.Selection.findOne({
          // With the same values
          where: {
            userId: { [Sequelize.Op.not]: userId },
            planId,
            eventId,
          },
        });

        // If the other selection exists
        if (otherMatch) {
          // Update the chosenPlanId in the Event table
          const eventUpdateResult = await models.Event.update(
            { chosenPlanId: planId, status: false },
            { where: { id: eventId } }
          );

          // If an event with the given ID was found and updated successfully
          if (eventUpdateResult[0] > 0) {
            // find the event with this userId
            const event = await models.Event.findOne({
              where: {
                id: eventId,
                [Sequelize.Op.or]: [{ userId_1: userId }, { userId_2: userId }],
              },
            });

            // if the current user is userId_1
            if (event.userId_1 === userId) {
              // then send pusher to userId_2
              notifications.sendMatch(
                event.userId_2,
                eventId,
                "You have a new date!"
              );
            } else {
              // otherwise send pusher to userId_1
              notifications.sendMatch(
                event.userId_1,
                eventId,
                "You have a new date!"
              );
            }

            res.send("Match found. Chosen plan updated in the event.");
          } else {
            res.send("No event found with the given ID.");
          }
        } else {
          res.send("You made a selection, waiting for the other user.");
        }
        // If there is no match, just post the selection
      } else {
        res.send("You made a selection!");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send(error);
    }
  }
});

//GET all selections

router.get("/", async function (req, res, next) {
  try {
    const selections = await models.Selection.findAll();
    res.status(200).send(selections);
    
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET selection of given user id and given event Id
router.get("/:userId/:eventId", async function (req, res, next) {
  const { userId, eventId } = req.params;
  try {
    const selection = await models.Selection.findAll({
      where: {
        userId,
        eventId,
      },
    });
    res.status(200).send(selection);
  } catch (error) {
    res.status(500).send(error);
  }
});



//DELETE ALL SELECTIONS
router.delete("/", async (req, res) => {
  try {
    // Delete all events
    await models.Selection.destroy({
      where: {},
      truncate: true, // This ensures that the table is truncated, removing all rows
    });

    res.send("All selections deleted successfully");
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
