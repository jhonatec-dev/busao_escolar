import dayjs from 'dayjs'
import type IRequest from '../interfaces/IRequest'
import type ServiceResult from '../interfaces/IService'
import travelModel from '../models/travel.model'

class RequestService {
  private async getTravelRequests (): Promise<IRequest[]> {
    const today = dayjs()
    const currYear = today.year()
    const currMonth = today.month() + 1
    const currDay = today.date()
    const tripsToList = await travelModel.model.find({
      $or: [
        {
          year: currYear,
          month: currMonth
        },
        {
          year: currYear,
          month: { $gt: currMonth }
        },
        {
          year: { $gt: currYear }
        }
      ]
    })

    // console.log('tripsToList', tripsToList)

    if (tripsToList.length === 0) {
      return []
    }

    const result: IRequest[] = []

    for (const trip of tripsToList) {
      trip.days.forEach((dayTravel) => {
        if (
          (trip.year === currYear &&
            trip.month === currMonth &&
            dayTravel.day >= currDay) ||
          (trip.year === currYear && trip.month > currMonth) ||
          trip.year > currYear
        ) {
          dayTravel.otherStudents.forEach((student) => {
            if (!student.approved) {
              result.push({
                name: student.name,
                date: `${trip.year}-${trip.month}-${dayTravel.day}`,
                request: 'travel'
              })
            }
          })
        }
      })
    }

    return result
  }

  public async getRequests (): Promise<ServiceResult<IRequest[]>> {
    try {
      const travelRequests = await this.getTravelRequests()

      return {
        status: 'SUCCESS',
        data: travelRequests
      }
    } catch (error) {
      return {
        status: 'INVALID',
        data: { message: (error as Error).message }
      }
    }
  }
} // class

export default new RequestService()
