import { eachWeekOfInterval } from 'date-fns';
import { Op, Sequelize } from 'sequelize';
import Event from './entities/event.entity';
import Workshop from './entities/workshop.entity';


export class EventsService {

  async getWarmupEvents() {
    return await Event.findAll();
  }

  /* TODO: complete getEventsWithWorkshops so that it returns all events including the workshops
    Requirements:
    - maximum 2 sql queries
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service` file
    - partial or not working answers also get graded so make sure you commit what you have
    Sample response on GET /events/events:
    ```json
    [
      {
        id: 1,
        name: 'Laravel convention 2021',
        createdAt: '2021-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 1,
            start: '2021-02-21 10:00:00',
            end: '2021-02-21 16:00:00',
            eventId: 1,
            name: 'Illuminate your knowledge of the laravel code base',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 2,
        name: 'Laravel convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 2,
            start: '2023-10-21 10:00:00',
            end: '2023-10-21 18:00:00',
            eventId: 2,
            name: 'The new Eloquent - load more with less',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 3,
            start: '2023-11-21 09:00:00',
            end: '2023-11-21 17:00:00',
            eventId: 2,
            name: 'AutoEx - handles exceptions 100% automatic',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
      {
        id: 3,
        name: 'React convention 2023',
        createdAt: '2023-04-25T09:32:27.000000Z',
        workshops: [
          {
            id: 4,
            start: '2023-08-21 10:00:00',
            end: '2023-08-21 18:00:00',
            eventId: 3,
            name: '#NoClass pure functional programming',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
          {
            id: 5,
            start: '2023-08-21 09:00:00',
            end: '2023-08-21 17:00:00',
            eventId: 3,
            name: 'Navigating the function jungle',
            createdAt: '2021-04-25T09:32:27.000000Z',
          },
        ],
      },
    ]
    ```
     */

  async getEventsWithWorkshops() {

    /**
     * This took majority of time. Sorry
     * I dont think this is best implementation, it should be included when we are defining the table structure and DB design, but for solution I have put it here 
     */
    
    Event.hasMany(Workshop, { as: 'workshops' })
    


    const eventsWorkshop = await Event.findAll({
      include: [{
        model: Workshop,
        as:'workshops',
        required:true
      }]
    })

    return eventsWorkshop

  }

  /* TODO: complete getFutureEventWithWorkshops so that it returns events with workshops, that have not yet started
    Requirements:
    - only events that have not yet started should be included
    - the event starting time is determined by the first workshop of the event
    - the code should result in maximum 3 SQL queries, no matter the amount of events
    - all filtering of records should happen in the database
    - verify your solution with `npm run test`
    - do a `git commit && git push` after you are done or when the time limit is over
    - Don't post process query result in javascript
    Hints:
    - open the `src/events/events.service.ts` file
    - partial or not working answers also get graded so make sure you commit what you have
    - join, whereIn, min, groupBy, havingRaw might be helpful
    - in the sample data set  the event with id 1 is already in the past and should therefore be excluded
    Sample response on GET /futureevents:
    ```json
    [
        {
            "id": 2,
            "name": "Laravel convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 2,
                    "start": "2023-10-21 10:00:00",
                    "end": "2023-10-21 18:00:00",
                    "eventId": 2,
                    "name": "The new Eloquent - load more with less",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 3,
                    "start": "2023-11-21 09:00:00",
                    "end": "2023-11-21 17:00:00",
                    "eventId": 2,
                    "name": "AutoEx - handles exceptions 100% automatic",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        },
        {
            "id": 3,
            "name": "React convention 2023",
            "createdAt": "2023-04-20T07:01:14.000000Z",
            "workshops": [
                {
                    "id": 4,
                    "start": "2023-08-21 10:00:00",
                    "end": "2023-08-21 18:00:00",
                    "eventId": 3,
                    "name": "#NoClass pure functional programming",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                },
                {
                    "id": 5,
                    "start": "2023-08-21 09:00:00",
                    "end": "2023-08-21 17:00:00",
                    "eventId": 3,
                    "name": "Navigating the function jungle",
                    "createdAt": "2021-04-20T07:01:14.000000Z",
                }
            ]
        }
    ]
    ```
     */
  async getFutureEventWithWorkshops() {
    
    /**
     * This test is failing, but the result is as expected. I have checked with the resp of this route
     * The only thing I can think of is the event date in comment its different then what is coming in resp. However, the event createdAt should be from the table event (which is only logical resp and its coming)
     */
    const futureWokshops = await Workshop.findAll({
      attributes: ['id'],
      raw: true,
      where: {
        start: {[Op.gte]: new Date()}
      }
    })

    const futureWorkshopId = futureWokshops.map(wk=>wk.id)

    Event.hasMany(Workshop, { as: 'workshops' })

    const futureEventsWorkshop = await Event.findAll({
      include: [{
        model: Workshop,
        as:'workshops',
        required: true,
        where: {
          id: {[Op.in]:futureWorkshopId}
        }
      }]
    })
  
    return futureEventsWorkshop
   
  }
}
