import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getFarmerProfile,
  clearFarmerProfile,
} from "../redux/slices/farmerSlice";
import { getProducts } from "../redux/slices/productSlice";
import { sendMessage } from "../redux/slices/messageSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import {
  FaLeaf,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaCalendarAlt,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaArrowLeft,
  FaComment,
} from "react-icons/fa";

const FarmerDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showMessageForm, setShowMessageForm] = useState(false);
  const [message, setMessage] = useState("");

  const { farmerProfile, loading } = useSelector((state) => state.farmers);
  const { products, loading: productsLoading } = useSelector(
    (state) => state.products
  );
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getFarmerProfile(id));
    dispatch(getProducts({ farmer: id }));

    return () => {
      dispatch(clearFarmerProfile());
    };
  }, [dispatch, id]);

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      return;
    }

    dispatch(
      sendMessage({
        receiver: id,
        content: message,
      })
    );

    setMessage("");
    setShowMessageForm(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (!farmerProfile) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
          Farmer profile not found
        </div>
      </div>
    );
  }

  const {
    name,
    email,
    phoneNumber,
    address,
    farmerProfile: profile,
  } = farmerProfile;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-6">
        <Link
          to="/farmers"
          className="flex items-center text-gray-600 hover:text-green-700"
        >
          <FaArrowLeft className="mr-2" />
          Back to Farmers
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-10">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-gradient-to-br from-green-500 to-green-700 p-8 text-white">
            <div className="flex flex-col h-full">
              <div className="flex-grow">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mb-6">
                  <FaLeaf className="text-4xl" />
                </div>
                <h1 className="text-3xl font-bold mb-2">{name}</h1>

                {address && (
                  <div className="flex items-start mb-4">
                    <FaMapMarkerAlt className="mt-1 mr-2" />
                    <p>
                      {address.street && `${address.street}, `}
                      {address.city && `${address.city}, `}
                      {address.state && `${address.state}, `}
                      {address.zipCode}
                    </p>
                  </div>
                )}

                {phoneNumber && (
                  <div className="flex items-center mb-4">
                    <FaPhone className="mr-2" />
                    <p>{phoneNumber}</p>
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <FaEnvelope className="mr-2" />
                  <p>{email}</p>
                </div>

                {profile && profile.establishedYear && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <p>
                      Established: {profile.establishedYear}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowMessageForm(!showMessageForm)}
                  className="w-full flex items-center justify-center bg-white text-green-700 hover:bg-green-50 font-bold rounded-lg px-6 py-3 transition-colors"
                >
                  <FaComment className="mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 p-8">
            {showMessageForm && (
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">
                  Send a message to {name}
                </h3>
                <form onSubmit={handleSendMessage}>
                  <textarea
                    className="w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  ></textarea>
                  <div className="flex justify-end mt-3 space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowMessageForm(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold mb-4">About the Farm</h2>
              {profile && profile.description ? (
                <p className="text-gray-700 mb-6">{profile.description}</p>
              ) : (
                <p className="text-gray-500 italic mb-6">
                  No farm description available.
                </p>
              )}
            </div>

            {profile && profile.farmingPractices && profile.farmingPractices.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Farming Practices
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.farmingPractices.map((practice, index) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                    >
                      {practice}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile && (profile.facebook || profile.instagram || profile.twitter) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">
                  Social Media
                </h3>
                <div className="flex space-x-4">
                  {profile.facebook && (
                    <a
                      href={profile.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaFacebook className="text-2xl" />
                    </a>
                  )}
                  {profile.instagram && (
                    <a
                      href={profile.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-800"
                    >
                      <FaInstagram className="text-2xl" />
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <FaTwitter className="text-2xl" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {profile && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Business Hours
                  </h3>
                  <p className="text-gray-700">
                    {profile.businessHours || t("Not specified")}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Order Options
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${profile.acceptsPickup
                          ? "bg-green-500"
                          : "bg-gray-300"
                          }`}
                      ></span>
                      Pickup
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`w-3 h-3 rounded-full mr-2 ${profile.offersDelivery
                          ? "bg-green-500"
                          : "bg-gray-300"
                          }`}
                      ></span>
                      Delivery
                      {profile.offersDelivery && profile.deliveryRadius && (
                        <span className="text-sm text-gray-500 ml-2">
                          ({profile.deliveryRadius} miles radius)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products from this Farmer</h2>
        </div>

        {productsLoading ? (
          <Loader />
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">
              No products available from this farmer yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDetailPage;
