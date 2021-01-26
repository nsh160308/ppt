import React from 'react'

function ProductDetailImage(props) {
    const renderDetailImage = () => {
        return props.images && props.images.map((image, index) => (
            <img 
                key={index} 
                src={`http://localhost:5000/${image}`}
                
            />
            
        ))
    }
    return (
        <div>
            {renderDetailImage()}
        </div>
    )
}

export default ProductDetailImage
