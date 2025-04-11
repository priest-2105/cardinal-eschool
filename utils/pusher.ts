import Pusher from "pusher-js"

// Initialize Pusher with your credentials
const pusher = new Pusher("8b36ef8aad2485f21c5f", {
  cluster: "us2",
  // Force TLS for secure connections
  forceTLS: true,
})

export default pusher

