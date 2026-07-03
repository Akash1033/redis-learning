import { Job, Worker } from "bullmq";
import { connection } from "./queue.js";

const emailWorker = new Worker(
    'emails',
    async(job) => {
        console.log("processing email job...", job.id ,job.name , job.data)
         (await new Promise((resolve) => setTimeout(resolve, 1500)),
         console.log('Email job Completed!', job.id, job.name, job.data));
    },
    {connection}
)

emailWorker.on('completed', (job) => {
    console.log('job completed!', job.id, job.name, job,data);
});


emailWorker.on('failed', (job, err) => {
    console.log('job failed!',job.id, job.name, job.data, err)
})