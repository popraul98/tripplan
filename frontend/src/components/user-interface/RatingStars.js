import React from "react";

const RatingStars = ({rating}) => {

    let decimal = rating - Math.floor(rating);

    return (
        <div>
            <ul className="flex  text-xs">
                <li>
                    <i className="fas fa-star fa-sm text-yellow-500 mr-1"></i>
                </li>
                <li>
                    <i className="fas fa-star fa-sm text-yellow-500 mr-1"></i>
                </li>
                <li>
                    <i className="fas fa-star fa-sm text-yellow-500 mr-1"></i>
                </li>
                <li>
                    <i className="far fa-star fa-sm text-yellow-500 mr-1"></i>
                </li>
                <li>
                    <i className="far fa-star fa-sm text-yellow-500 mr-1"></i>
                </li>
            </ul>
        </div>
    )

}

export default RatingStars;

//fas = full star
//far = half star

// //3.2  3 stele
// //3.3 - 3.8  3 stele jumate
// //3.9 - 4 stele
// //star  <i class="fas fa-star"></i>
// //half-star   <i class="fas fa-star-half-alt"></i>
// //empty star    <i class="far fa-star"></i>
//
// let rating = 1.3;
// console.log(rating);
// let decimal = rating - Math.floor(rating);
// let stars = document.getElementById("stars");
//
// if (decimal < 0.28) {
//     rating = Math.floor(rating);
//     for (let i = 1; i <= rating; i++) {
//         stars.innerHTML = stars.innerHTML + "<i class=\"fas fa-star\"></i>";
//     }
// }
//
// if (decimal > 0.21 && decimal < 0.88) {
//     rating = Math.floor(rating);
//     for (let i = 1; i <= rating; i++) {
//         stars.innerHTML = stars.innerHTML + "<i class=\"fas fa-star\"></i>";
//     }
//     stars.innerHTML = stars.innerHTML + "<i class=\"fas fa-star-half-alt\"></i>";
// }
//
// if (decimal > 0.8) {
//     rating = Math.ceil(rating);
//     for (let i = 1; i <= rating; i++) {
//         stars.innerHTML = stars.innerHTML + "<i class=\"fas fa-star\"></i>";
//     }
// }
//
// let empty_stars = 5 - stars.childElementCount;
// for (let i = 1; i <= empty_stars; i++) {
//     stars.innerHTML = stars.innerHTML + "<i class=\"far fa-star\"></i>";
// }
