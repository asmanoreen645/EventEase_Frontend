import { useState } from 'react';
import toast from 'react-hot-toast';
import './VendorRegisterationform.css'; 

const VendorRegister = () => {
  const [documents, setDocuments] = useState({
    cnicFront: null,
    businessLicense: null,
  });

  const [docErrors, setDocErrors] = useState({
    cnicFront: '',
    businessLicense: '',
  });

  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      const typeError = 'Only JPG, PNG, and PDF formats are allowed!';
      setDocErrors((prev) => ({ ...prev, [docType]: typeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(typeError);
      e.target.value = '';
      return;
    }

    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      const sizeError = `File size (${fileSizeMB.toFixed(1)}MB) exceeds the 5MB limit!`;
      setDocErrors((prev) => ({ ...prev, [docType]: sizeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(sizeError);
      e.target.value = '';
      return;
    }

    setDocErrors((prev) => ({ ...prev, [docType]: '' }));
    setDocuments((prev) => ({ ...prev, [docType]: file }));
    toast.success(`${file.name} selected successfully!`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!documents.cnicFront || !documents.businessLicense) {
      toast.error("Please upload all required documents!");
      return;
    }
    toast.success("Documents submitted successfully!");
  };

  return (
    <div className="vendor-register-container">
      <div className="vendor-register-card">
        <h2>Vendor Verification</h2>
        <p>Upload your verification documents to start selling.</p>

        <form onSubmit={handleSubmit}>
          {/* 1. CNIC Front Input */}
          <div>
            <label>CNIC / ID CARD (MAX 5MB - JPG, PNG, PDF)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'cnicFront')}
            />
            {docErrors.cnicFront && (
              <p className="error-msg">{docErrors.cnicFront}</p>
            )}
          </div>

          {/* 2. Business License Input */}
          <div>
            <label>BUSINESS LICENSE / DOCUMENT (MAX 5MB - JPG, PNG, PDF)</label>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(e) => handleFileChange(e, 'businessLicense')}
            />
            {docErrors.businessLicense && (
              <p className="error-msg">{docErrors.businessLicense}</p>
            )}
          </div>

          <button type="submit">
            Submit Documents
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;