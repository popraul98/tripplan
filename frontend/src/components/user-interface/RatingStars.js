import React, {useEffect, useState, useRef} from "react";
import ReactDOM from "react-dom";
import {useReactToPrint} from "react-to-print";

const RatingStars = ({rating}) => {

    let decimal = rating - Math.floor(rating);
    const star = React.createElement('i', {'className': "fas fa-star fa-sm text-yellow-500 mr-1"});
    const half_star = React.createElement('i', {'className': "fas fa-star-half-alt text-yellow-500 mr-1"});
    const empty_star = React.createElement('i', {'className': "far fa-star fa-sm text-yellow-500 mr-1"});

    // let full_stars = [];
    const [fullStars, setFullStars] = useState([])
    const [halfStars, setHalfStars] = useState([])
    const [emptyStars, setEmptyStars] = useState([])

    const renderStars = () => {

        let array_full_stars = [];
        let array_half_stars = [];
        let array_empty_stars = [];

        if (decimal < 0.28) {
            for (let i = 1; i <= Math.floor(rating); i++) {
                console.log('da')
                array_full_stars.push(1);
            }
            setFullStars(array_full_stars)
        }

        if (decimal > 0.21 && decimal < 0.88) {
            for (let i = 1; i <= Math.floor(rating); i++) {
                console.log('daa')
                array_full_stars.push(1);
            }
            setFullStars(array_full_stars)
            array_half_stars.push(1)
            setHalfStars(array_half_stars)
        }

        if (decimal > 0.8) {
            for (let i = 1; i <= Math.ceil(rating); i++) {
                console.log('daaa')
                array_full_stars.push(1);
            }
            setFullStars(array_full_stars)
        }

        let empty_stars = 5 - (array_full_stars.length + array_half_stars.length);
        for (let i = 1; i <= empty_stars; i++) {
            array_empty_stars.push(1);
        }
        setEmptyStars(array_empty_stars);

        console.log(rating)
        console.log(decimal)
        console.log(array_full_stars, 'full')
        console.log(array_half_stars, 'half')
        console.log(array_empty_stars, 'empty')
    }

    useEffect(() => {
        renderStars()

    }, [])


    return (
        <div>
            <div className="flex  text-xs" id="componentRef">
                {fullStars ? fullStars.map((item) => (
                    <div>{star}</div>
                )) : ""}
                {halfStars ? halfStars.map((item) => (
                    <div>{half_star}</div>
                )) : ""}
                {emptyStars ? emptyStars.map((item) => (
                    <div>{empty_star}</div>
                )) : ""}
            </div>
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
