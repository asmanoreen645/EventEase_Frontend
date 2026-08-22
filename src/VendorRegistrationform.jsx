import { useState } from 'react';
import toast from 'react-hot-toast';

const VendorRegister = () => {
  const [documents, setDocuments] = useState({
    cnicFront: null,
    businessLicense: null,
  });

  const [docErrors, setDocErrors] = useState({
    cnicFront: '',
    businessLicense: '',
  });

  // Allowed Config: Max 5MB & Specific File Types
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  // File Select Handler with Limits Check
  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];

    if (!file) return;

    // 1. Check File Type (JPG, PNG, PDF Only)
    if (!ALLOWED_TYPES.includes(file.type)) {
      const typeError = 'Only JPG, PNG, and PDF formats are allowed!';
      setDocErrors((prev) => ({ ...prev, [docType]: typeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(typeError);
      e.target.value = ''; // Input clear kar dein
      return;
    }

    // 2. Check File Size (Max 5MB)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      const sizeError = `File size (${fileSizeMB.toFixed(1)}MB) exceeds the 5MB limit!`;
      setDocErrors((prev) => ({ ...prev, [docType]: sizeError }));
      setDocuments((prev) => ({ ...prev, [docType]: null }));
      toast.error(sizeError);
      e.target.value = ''; // Input clear kar dein
      return;
    }

    // Validation Pass (No Errors)
    setDocErrors((prev) => ({ ...prev, [docType]: '' }));
    setDocuments((prev) => ({ ...prev, [docType]: file }));
    toast.success(`${file.name} selected successfully!`);
  };

  return (
    <div className="vendor-form">
      <h2>Vendor Verification Documents</h2>

      {/* 1. CNIC Front Input */}
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>CNIC / ID Card (Max 5MB - JPG, PNG, PDF)</label>
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange(e, 'cnicFront')}
        />
        {docErrors.cnicFront && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {docErrors.cnicFront}
          </p>
        )}
      </div>

      {/* 2. Business License Input */}
      <div className="input-group" style={{ marginBottom: '20px' }}>
        <label>Business License / Document (Max 5MB - JPG, PNG, PDF)</label>
        <input 
          type="file" 
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFileChange(e, 'businessLicense')}
        />
        {docErrors.businessLicense && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
            {docErrors.businessLicense}
          </p>
        )}
      </div>
    </div>
  );
};

export default VendorRegister;