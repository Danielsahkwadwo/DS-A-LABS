exports.createCookie = function (res, token) {
  const cookies = res.cookie("userInfo", token, {
    path: "/",
    sameSite: true,
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 86400 * 5 * 1000),
  });
  return cookies;
};

exports.deleteCookie = function (res) {
  const cookies = res.clearCookie("userInfo", { path: "/" });
  return cookies;
};
