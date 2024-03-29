import api from "../services/data";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
// import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

// USER FLOW

// 1. user1 search for user2
// 2. is its found, user1 have the option of sending invitation to user2
// 3. user1 press invitation button and back end register a new event with user 1 and user2 and send back the new event hash
// 4. user1 receive invitation confirmation and a option to start the selection
// 5. user1 press start and is redirect to selection/event page with the hash of the event

//// notification page would check on events table if there is an open event for the user and if there is, it would show the invitation there

// 6. user2 login and sees a notification of a new invitation
// 7. user2 press the notification and has the option to open the invitation
// 8. user2 press accept and is redirect to selection/event page with the hash of the event

export default function Search() {
	var username = localStorage.getItem("username");
	const [userSearch, setUserSearch] = useState("");
	const [invitee, setInvitee] = useState("");
	const navigate = useNavigate();
	const [errorMsg, setErrorMsg] = useState("");
	const [invitationMsg, setInvitationMsg] = useState("");
	const [eventId, setEventId] = useState("");
	// const [data, setData] = useState("");
	// const [user, setUser] = useState("");

	useEffect(() => {
		setInvitee({});
	}, []);

	useEffect(() => {
		console.log(errorMsg);
	}, [errorMsg]);

	const handleSearch = (e) => {
		e.preventDefault();
		setInvitationMsg("");
		searchUser();
		setUserSearch("");
	};

	const searchUser = async () => {
		try {
			const data = await api.getUsername(userSearch);
			data && setInvitee(data);
			data && setErrorMsg("");
			console.log(errorMsg);
			console.log(data);
		} catch (error) {
			console.log(error);
			setErrorMsg(error.message + "  😞");
		}
	};

	const handleInvitation = async () => {
		// console.log(invitee);
		try {
			const data = await api.createEvent(invitee.id);

			if (data) {
				console.log(data);
				setEventId(data.event.id);
				setInvitationMsg(`${invitee.username} has been invited!`);
			}
		} catch (error) {
			console.log(error);
			setErrorMsg(error.message);
			error.message.includes("open") ?
				setErrorMsg(`${error.message} with ${invitee.username}. \n Check your notifications 👀`
				) : setErrorMsg(error.message);
		}
		setInvitee({});
	};

	const handleStart = () => {
		console.log("event id" + eventId);
		navigate(`/event/${eventId}`);
	};

	const handleChange = (e) => {
		setUserSearch(e.target.value);
	};

	return (
		<div>
			<div className="search-box">
				<form>
					<div className="search-field">
						<h1>Hello {username}!</h1>
						<p>Search for a partner to match on a new date.🌞</p>
						<label htmlFor="eventTitle">Search by username</label>
						<div>
							<input
								type="text"
								id="eventTitle"
								name="eventTitle"
								value={userSearch}
								onChange={handleChange}
							/>
							<button
								className="submit-button"
								type="submit"
								onClick={handleSearch}
							>
								<SearchIcon />
							</button>
						</div>
					</div>
				</form>
				{invitee.username && (
					<div className="found msg">
						<p>
							{invitee.username} <span>user found!</span>
						</p>
						<button id="cta-btn" onClick={handleInvitation}>Invite</button>
					</div>
				)}

				{errorMsg && <div className="msg not-found">{errorMsg}</div>}
				{invitationMsg && (
					<div className="confirmation">
						{invitationMsg}
						<p>Press Start to begin your selection.</p>
						<button onClick={handleStart}>Start</button>
					</div>
				)}
			</div>

			{/* <div className="share-link">
                <a>Or send registration Link </a><a><SendIcon /></a>
                </div> */}
		</div>
	);
}
