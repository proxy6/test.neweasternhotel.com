const AdminService = require("../services/admin.service");
const {formatInTimeZone, toZonedTime, fromZonedTime} = require('date-fns-tz');
const axios = require('axios')
module.exports = {
    getIndexPage: async(req, res)=>{
        try{
        const limit = 2
        const page = req.query.page || 1
        const upcomingEvent = await module.exports.getLatestUpcomingEvent(req, res);
        const latestEvent = await module.exports.getLatestPastEvent(req, res);
        const sermons = await AdminService.GetSermonList(page, 3)
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('index', {
            upcomingEvent: upcomingEvent || latestEvent,
            sermons,
            footerSermons,
            footerEvents
        })
    }catch(ex){
        console.error("Index Page Error" + ex)
        res.render('index')
    }
    },
    getAboutUsPage:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('about', {footerSermons, footerEvents})
    },
    getContactUsPage:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('contact', {footerSermons, footerEvents})
    },
    getPastorsTomsInfo:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('pastor-tom', {footerSermons, footerEvents})
    },
    getPastorsChristianaInfo:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('pastor-christina', {footerSermons, footerEvents})
    },
    getNewMemberForm:async(req, res)=>{
        const countries = await getCountries();
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('join-us', {countries, footerSermons, footerEvents})
    },
    getDonationForm:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('donate', {footerSermons, footerEvents})
    },
    postDonationForm:async(req, res)=>{
       
        let donation = await AdminService.AddDonation(req.body)
        if(!donation) return res.status(500).json({message: "Internal Server Error - Failed to send Donation Form"})
        //save product in Donor Page
        return res.status(200).json({message: "Donation Form Sent Successfully"})
    
    },

    postPrayerRequest:async(req, res)=>{
     
        let prayer = await AdminService.AddPrayerRequest(req.body)
        if(!prayer) return res.status(500).json({message: "Error - Failed to send Prayer Request"})
        //save product in Donor Page
        console.log(prayer)
        return res.status(200).json({message: "Prayer Request Submitted"})
    
    },
    
    getPastorsDesk:async(req, res)=>{
        try{
            const limit = 9
            const page = req.query.page || 1
            const articles = await AdminService.GetPastorDeskList(page, limit)
            articles.forEach(async article => {
                //use the ministerId and fetch the pic for minister
            const minister = await AdminService.GetSingleUser(article.minister_id)
            if(minister){
                article.label_photo = minister.user_photo
            }
            });
            
            const footerSermons = await AdminService.GetSermonList(1, 2)
            footerSermons.forEach(async sermon => {
                //use the ministerId and fetch the pic for minister
            const minister = await AdminService.GetSingleUser(sermon.minister_id)
            if(minister){
                sermon.label_photo = minister.user_photo
            }
            });
            const footerEvents = await AdminService.GetEventList(1, 6)
            let articlesCount = await AdminService.CountPastorsDesk()
            let totalPages = Math.ceil(articlesCount / limit);
            let currentPage = page
            res.render('pastors-desk', {
                articles, footerSermons, footerEvents, totalPages, currentPage
            })
      
            }catch(ex){
                console.error("Error in Get Pastors Desk Page" + ex)
                res.render('pastors-desk')
            }
    },
    getSinglePastorsDesk:async(req, res)=>{
        try{
        const {id} = req.params
        const limit = 5
        const page = req.query.page || 1
        const article = await AdminService.GetSinglePastorsDesk(id)
        const minister = await AdminService.GetSingleUser(article.minister_id)
        if(minister){
            article.label_photo = minister.user_photo
        }
        const articles = await AdminService.GetPastorDeskList(page, limit)
        articles.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        if(minister){
            sermon.label_photo = minister.user_photo
        }
        });
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        if(minister){
            sermon.label_photo = minister.user_photo
        }
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('pastors-desk-single', {article, articles, footerSermons, footerEvents})
        }catch(ex){
            console.error("Get Single Article Page Error" + ex)
            res.render('pastors-desk-single')
        }
    },
   
    getSermonPage:async(req, res)=>{
        try{
        const limit = 9
        const page = req.query.page || 1
        console.log(page)
        const sermons = await AdminService.GetSermonList(page, limit)
        sermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        let sermonCount = await AdminService.CountSermons()
            let totalPages = Math.ceil(sermonCount / limit);
            console.log(totalPages)
            let currentPage = page
        res.render('sermons', {
            sermons, footerSermons, footerEvents, totalPages, currentPage

        })
        }catch(ex){
            console.error("Error in Get Sermons Page" + ex)
            res.render('sermons')
        }
    },
    getSingleSermon:async(req, res)=>{
        try{
        const {id} = req.params
        const limit = 5
        const page = req.query.page || 1
        const sermon = await AdminService.GetSingleSermon(id)
        //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        const sermons = await AdminService.GetSermonList(page, limit)
        sermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('sermon-single', {sermon, sermons, footerSermons, footerEvents})
        }catch(ex){
            console.error("Get Single Sermon Page Error" + ex)
            res.render('sermon-single')
        }
    },
    getEventPage:async(req, res)=>{
        try{
        const limit = 10
        // const sermonLimit = 12
        const page = req.query.page || 1
        const events = await AdminService.GetEventList(page, limit)
        // const sermons = await AdminService.GetSermonList(page, sermonLimit)
        // sermons.forEach(async sermon => {
        //     //use the ministerId and fetch the pic for minister
        // const minister = await AdminService.GetSingleUser(sermon.minister_id)
        // sermon.label_photo = minister.user_photo
        // });
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        let eventCount = await AdminService.CountSermons()
        let totalPages = Math.ceil(eventCount / limit);
        let currentPage = page
        res.render('events', {
            events, footerSermons, footerEvents, totalPages, currentPage
        })
        }catch(ex){
            console.error("Get Sermon Page Error" + ex)
            res.render('events')
        }
    },
    getSingleEvent:async(req, res)=>{
        try{
        const {id} = req.params
        const limit = 9
        const page = req.query.page || 1
        const event = await AdminService.GetSingleEvent(id)
        console.log(event)
        const events = await AdminService.GetEventList(page, limit)
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        console.log(minister)
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('event-single', {event, events, footerSermons, footerEvents})
        }catch(ex){
            console.error("Get Single Event Page Error" + ex)
            res.render('event-single')
        }
    },
    getLiveStreamPage:async(req, res)=>{
        try{
        const {id} = req.params
        const limit = 9
        const page = req.query.page || 1
        const event = await AdminService.GetSingleEvent(id)
        const events = await AdminService.GetEventList(page, limit)
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('livestream', {event, events, footerSermons, footerEvents})
        }catch(ex){
            console.error("Get LiveStream Page Error" + ex)
            res.render('livestream')
        }
    },
    getLiveStream:async(req, res)=>{
        try{
            const limit = 9
            const page = req.query.page || 1
            // const event = await AdminService.GetSingleEvent(id)
            const events = await AdminService.GetEventList(page, limit)
            const footerSermons = await AdminService.GetSermonList(1, 2)
            footerSermons.forEach(async sermon => {
                //use the ministerId and fetch the pic for minister
                const minister = await AdminService.GetSingleUser(sermon.minister_id)
                sermon.label_photo = minister.user_photo
            });
            const footerEvents = await AdminService.GetEventList(1, 6)
            //check if livetream was set
            let livestream = await AdminService.GetLiveStreamEvent()
            if(livestream){
                console.log("got here")
                console.log(livestream)
                return res.render('livestream', {
                    event: livestream,
                    events, 
                    footerSermons,
                    footerEvents
                }) 
            }
            const upcomingEvent = await module.exports.getLatestUpcomingEvent(req, res);
            const latestEvent = await module.exports.getLatestPastEvent(req, res);
            console.log(upcomingEvent)
            console.log(latestEvent)
            res.render('livestream', {
                event: upcomingEvent || latestEvent,
                events, 
                footerSermons,
                footerEvents
            })
    }catch(ex){
        console.error("Get LiveStream Error" + ex)
        res.render('livestream')
    }
    
    },
    getLatestUpcomingEvent: async(req, res)=>{
        try {
            const forwardedFor = req.headers['x-forwarded-for'];
            let ipAddress;

            if (forwardedFor) {
            // Split the header value by commas and take the first IP
                ipAddress = forwardedFor.split(',')[0].trim();
            } else {
            // Fallback to req.connection.remoteAddress if x-forwarded-for is not present
                 ipAddress = req.connection.remoteAddress;
            }
            //ipAddress = "161.185.160.93"
            const userTimezone = await GetTimezone(ipAddress)
            // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const userDateTime = new Date()
            const userUtcDateTime = fromZonedTime(userDateTime, userTimezone);
            const event = await AdminService.GetLatestUpcomingEvent(userUtcDateTime);
         
            if (event) {
             
              return event
            } else {
              return null
            }

            
          } catch (ex) {
            console.error('Error in getLatestUpcomingEvent:' + ex);
            return null
          }
    },
    getLatestPastEvent: async(req, res)=>{
        try{
            const forwardedFor = req.headers['x-forwarded-for'];
            let ipAddress;

            if (forwardedFor) {
            // Split the header value by commas and take the first IP
                ipAddress = forwardedFor.split(',')[0].trim();
            } else {
            // Fallback to req.connection.remoteAddress if x-forwarded-for is not present
                 ipAddress = req.connection.remoteAddress;
            }
            //ipAddress = "161.185.160.93"
            const userTimezone = await GetTimezone(ipAddress)
            // const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const userDateTime = new Date()
            const userUtcDateTime = fromZonedTime(userDateTime, userTimezone);
        
            const event = await AdminService.GetLatestPastEvent(userUtcDateTime);
            if (event) {
         
                return event
            } else {
            return null
            }
    }catch(ex){
        console.error("getLatestPastEvent Error" + ex)
        return null
    }

    },
    addNewMember: async(req, res)=>{
        try{     
       
            const existingUser = await AdminService.GetSingleUserByEmail(req.body.email)
            if (existingUser) {
                return res.status(400).json({ message: 'User Email Already Exists' });
            }
            const user = await AdminService.AddUser(req.body)
            res.send(user)
               
            }catch(e){
                console.log(e)
                res.status(500).json({ message: 'Internal Server Error' });
            }
    },
    getBeliefPage:async(req, res)=>{
        const footerSermons = await AdminService.GetSermonList(1, 2)
        footerSermons.forEach(async sermon => {
            //use the ministerId and fetch the pic for minister
        const minister = await AdminService.GetSingleUser(sermon.minister_id)
        sermon.label_photo = minister.user_photo
        });
        const footerEvents = await AdminService.GetEventList(1, 6)
        res.render('belief', {footerSermons, footerEvents})
    },
}
const formatDateTime = function(userZonedTime) {
    const date = new Date(userZonedTime)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return {
      date: `${year}-${month}-${day}`,
      time: `${hours}:${minutes}`
    };
  }
  const GetTimezone = async ipAddress =>{
    try{
        console.log(ipAddress)
        // Use an IP geolocation service to fetch the user's time zone based on their IP address
        const response = await axios.get(`https://api.ipdata.co/${ipAddress}?api-key=${process.env.IPDATA_KEY}`);
        const timeZone = response.data.time_zone.name;
        return timeZone
    }catch(ex){
        // console.log(ex)
    }
    
}
  const getCountries = async()=>{
    try{
        const apiUrl = 'https://countriesnow.space/api/v0.1/countries/iso';

        const response = await axios.get(apiUrl)
        const countries = response.data.data;
        return countries
    }catch(error){
        console.error('Error:', error);  
    }
}
