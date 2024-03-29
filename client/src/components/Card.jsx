import PropTypes from "prop-types";

export default function Card({ planContent }) {
	return (
		<div className="card-box">
			{planContent.name === "No more options" ? (
				<div className="card last">
					<div className="card__image ">
						<img
							src={planContent.imageSrc} // Accede a la imagen del plan desde planContent
							alt=""
						/>
					</div>
					<div className="card__info last-card">
						<h2>{planContent.name}</h2>{" "}
						{/* Accede al título del plan desde planContent */}
						<p className="last-msg">{planContent.shortDescription}</p>{" "}
					</div>
				</div>
			) : (
				<div
					className={
						planContent.name !== null ? "card" : "empty-card"
					}
				>
					<div className="card__image">
						<img
							src={planContent.imageSrc} // Accede a la imagen del plan desde planContent
							alt=""
						/>
					</div>
					<div className="card__info">
						<h2>{planContent.name}</h2>{" "}
						{/* Accede al título del plan desde planContent */}
						<p >{planContent.shortDescription}</p>{" "}
						{/* Accede a la descripción del plan desde planContent */}
					</div>
				</div>
			)}
		</div>
	);
}

Card.propTypes = {
  planContent: PropTypes.shape({
    imageSrc: PropTypes.string.isRequired, // Agrega la validación para 'imageSrc'
    name: PropTypes.string.isRequired,
    shortDescription: PropTypes.string.isRequired,
  }).isRequired,
};
