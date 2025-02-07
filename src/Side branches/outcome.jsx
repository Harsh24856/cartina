import ReactMarkdown from 'react-markdown';

          <div className="recommendations">
            <h2>Your Roadmap to Success</h2>
            <div className="recommendation-content">
              {recommendations ? (
                <ReactMarkdown>
                  {recommendations}
                </ReactMarkdown>
              ) : (
                <p className="no-recommendations">
                  No recommendations available. Please try again.
                </p>
              )}
            </div>
          </div> 