import React, { Component } from 'react';

class Footer extends Component {

  render() {
    const { root, content } = this.styles;

    return (
      <footer style={ root }>
        <div style={ content }>
          <span dangerouslySetInnerHTML={ { __html: '<a class="github-button" href="https://github.com/iam4x/isomorphic-flux-boilerplate" data-icon="octicon-star" data-style="mega" data-count-href="/iam4x/isomorphic-flux-boilerplate/stargazers" data-count-api="/repos/iam4x/isomorphic-flux-boilerplate#stargazers_count" data-count-aria-label="# stargazers on GitHub" aria-label="Star iam4x/isomorphic-flux-boilerplate on GitHub">Star</a><a class="github-button" href="https://github.com/iam4x/isomorphic-flux-boilerplate/fork" data-icon="octicon-git-branch" data-style="mega" data-count-href="/iam4x/isomorphic-flux-boilerplate/network" data-count-api="/repos/iam4x/isomorphic-flux-boilerplate#forks_count" data-count-aria-label="# forks on GitHub" aria-label="Fork iam4x/isomorphic-flux-boilerplate on GitHub">Fork</a>' } }/>
        </div>
      </footer>
    );
  }

  styles = {
    root: {
      marginTop: 50
    },
    content: {
      paddingTop: 10,
      textAlign: 'center'
    }
  }

}

export default Footer;
