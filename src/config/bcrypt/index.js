import bcrypt from "bcrypt";

const bcryptHash = async (data, res) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hashData = await bcrypt.hash(data, salt);
    return hashData;
  } catch (error) {
    res.json({
      status: 500,
      message: "Data encryption error!!!",
    });
  }
};

export default bcryptHash;
