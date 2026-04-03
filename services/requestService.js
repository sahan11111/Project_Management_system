import ErrorHandler from "../middlewares/error.js";
import { SupervisorRequest } from "../models/supervisorRequest.js";

export const createRequest = async (requestData) => {
    const existingRequest = await SupervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "pending",
    });

    if (existingRequest) {
        return {
            request: existingRequest,
            isExisting: true,
        };
    }

    const request = await SupervisorRequest.create(requestData);
    return {
        request,
        isExisting: false,
    };
};

