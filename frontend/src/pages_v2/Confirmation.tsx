import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@components/global/Button';

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleReviewClick = () => {
    navigate('/final-usage-summary');
  };

  const handleCancelClick = () => {
    navigate(-1);
  };

  return (
    <div className=" align-items-start flex justify-center  px-4">
      <div className="bg-white rounded-xl shadow-lg p-4 justify-center max-w-xl w-full p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center text-blue-800">
          You’re about to mark this consumer as{' '}
          <span className="text-orange-500">Vacant</span>
        </h2>
        <p className="text-gray-600 text-lg text-start m-6">
          Please review the usage summary before confirming.
        </p>

        <p className="font-semibold text-base mb-4 text-gray-800">This action will:</p>
        <ul className="space-y-4 text-gray-700 text-base">
          {[
            "Freeze final meter reading and disable usage at the time of consumer checkout.",
            "Generate the consumer’s final bill based on recorded usage.",
            "Further bill generation for this meter shall be disabled."
          ].map((text, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-green-100">
                <img
                  src="icons/check.svg"
                  alt="check"
                  className="w-4 h-4 text-green-600"
                />
              </div>
              <span>{text}</span>
            </li>
          ))}
        </ul>

        <div className="flex  align-items-center justify-center w-full  mt-10 gap-x-4">
          <Button label="Yes, Review" onClick={handleReviewClick} className="w-full" />
          <Button label="Cancel" variant="secondary" onClick={handleCancelClick} className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
