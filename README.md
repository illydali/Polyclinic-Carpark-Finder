# Polyclinic-Carpark-Finder
Trent Global Interactive Map Project 01.

This project is based on the five planes of UI/UX
- Strategy
- Scope
- Structure
- Skeleton
- Surface

# Live URL 
The site can be accessed here- https://relaxed-poincare-48f513.netlify.app/.


# Strategy 
Parkade is a mobile-responsive and interactive map developed to
assist its users in finding car park lots availabilty near polyclinics as
well as nearby community centers in Singapore. This app aims to
save and expedite user's travelling journey by allowing them to
quickly view the carpark availability through the use of current location
tracking.

## Site Owner Goals
Understanding the hassle of parking is the driving factor in creating
this website. While some would argue that having a vehicle is a
luxury in Singapore, others find it a need. Medical institutions have
high number of visitors and the ratio in providing parking space is
sadly, unmatched. Utilizing real time location finder eases and
reduces the waiting game to a fraction. 

- Navigate the platform with ease
- Find the desired polyclinic
- Discover nearby community center
- Locate their current coordinates

## User Stories 
- As a user, I want to to know which carpark nearest to a polyclinic (or community club) I am visiting 
has the most number of lots available. 
- As a user, I need a quick and fast way to search for alternate carpark locations when the need arises.

# Scope 
## Functional
- User is able to view an updated list of all polyclinic information in Singapore.
- If chosen, the user will be able to locate current location. 
- The user is able to filter through options. 

## Content 
- Live updates of carpark availability.
- Information of carpark locations.
- Information of polyclinic and club locations.

## Non-functional requirements
- Mobile responsiveness
- Performance. 

# Structure
This is a single page website that is split into different sections.

- Navbar
- Map
- Tab Filters
- Switch view

[![Parkade-Skeleton.png](https://i.postimg.cc/ZRkCr962/Parkade-Skeleton.png)](https://postimg.cc/wtVqzjfQ)

## Navigation design
Navbar
- The navbar is mobile responsive and contains the 'About me' and 'Sign up' page.
- The navbar is collapsible when viewing in smaller devices. 

### About & Sign Up modals
- Contains basic information describing the functionalities on the website.
- Also contains 'Future updates'.
- User is able to subscribe via email to get information on future releases.

### Tab Filters
- User is able to select a checkbox to view markers of polyclinic or community club information.
- Upon clicking on each marker, user is able to view additional information on pop ups. 
- User is also able to select locate me and click to find location. Map will fly to user location and draw a circle showing a 500m radius.

### Switch View button
- User is able to switch to night mode view upon as an option.

# Skeleton 

[![Parkade-Skeleton-2.jpg](https://i.postimg.cc/mDG7TppP/Parkade-Skeleton-2.jpg)](https://postimg.cc/HJBr2zgm)

# Surface
## Color
User - friendly colors to allow easy navigation and for ease of use. 
Colors used are 
 - White
 - Blue
 - Yellow 

## Fonts 
Font for the website is from Google Fonts. 
 - Black Hans Sans for Logo and Landing page.
 - DM Serif Display for website body. 

# Testing
1. Test that user is able to reach map. 
    - User is able to arrive and open map upon clicking "Enter" 
2. Test user using sign up form.
    - Clicks on "Sign Up" button
    - User tries submitting empty form. 
    - User is prompted for invalid form entries when using incorrect format.
3. Test that user is able to locate. 
    - Clicks on Locate tab
    - Clicks on 'Find' button
    - Map zooms to user location and opens carpark markers. 
4. Test that user is able to view polyclinic info.
    - Clicks on Polyclinic tab
    - Tab opens list of polyclinics
    - User selects a polyclinic
    - Map zooms to polyclinic marker selected 
5. Test that user is able to select layers.


# Technologies Used
## Languages, Plugins and Libraries
- HTML
- CSS
- Javascript
- Bootstrap 5.1
- Axios
- Leaflet 1.7.1
- Leaflet Marker Cluster https://github.com/Leaflet/Leaflet.markercluster
- http://proj4js.org/

## API
- data.gov.sg 
- Foursquare 

## Design & Fonts
- SvgRepo.com
- Fontawesome.com
- Google Fonts
- Pexel.com
