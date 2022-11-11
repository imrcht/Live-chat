const mongoose = require('mongoose');

const techSchema = new mongoose.Schema(
  {
    tech_id: String,
    tech: String,
    user_email: String,
    username: String,
    socket_id: String,
    team_email: String,
    member_email: String,
    member_name: String,
    member_socket_id: String,
    team_id: String,
  },
  {
    timestamps: true,
  }
);

const Tech = mongoose.model('Tech', techSchema);
module.exports = Tech;
