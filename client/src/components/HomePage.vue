<!-- 
          
          
          This web application is a single page application 
          the page is devided into multiple components & rendered as per user request,
          it communicates with the backend api.
          Author:tarik
          Last Modified Date: feb 27 , 2021


-->

<template>
  <div>
    <!-- navbar-->
    <header class="header bg-white newHeader">
      <div class="container px-0 px-lg-3">
        <nav class="navbar navbar-expand-lg navbar-light py-3 px-lg-0">
          <router-link
            :to="{ name: 'Home' }"
            style="text-decoration: none; pointer:hand"
          >
            <a @click="realodpage"
              ><span class="font-weight-bold text-uppercase text-dark"
                >Auto Bridge</span
              ></a
            >
          </router-link>
          <button
            class="navbar-toggler navbar-toggler-right"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a class="nav-link text-small" href="#" @click="viewCartItem()">
                  <i
                    class="fa fa-cart-plus mr-1 text-gray"
                    aria-hidden="true"
                  ></i>
                  <small class="text-gray">({{ cartItem.length }})</small></a
                >
              </li>
              <li class="nav-item" id="like" @click="liked()">
                <a class="nav-link text-small" href="#" style="color:red">
                  <i class="fa fa-heart mr-1"></i
                  ><small class="text-gray ">
                    ({{ likedProduct.length }})</small
                  ></a
                >
              </li>

              <li class="nav-item" id="account" v-if="!isloggedin">
                <a class="nav-link " href="#" @click="account"> ACCOUNT</a>
              </li>
              <li class="nav-item" id="contactus" v-if="isloggedin">
                <a class="nav-link " href="#" @click="blog()"> BLOG</a>
              </li>
              <li class="nav-item" id="contactus" v-if="!isloggedin">
                <a class="nav-link " href="#" @click="goTocontactus">
                  CONTACT US</a
                >
              </li>
              <li class="nav-item " id="dashboard" v-if="isloggedin">
                <a class="nav-link" href="#" @click="goTodashboard"
                  ><i class="fa fa-home"></i> DASHBOARD</a
                >
              </li>
              <li
                class="nav-item dropdown"
                id="notify"
                v-if="isloggedin && loggedInRole == 'admin'"
              >
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  @click="readNotifications()"
                >
                  <i class="fa fa-bell"></i> ({{ mcount }} )
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdown"
                >
                  <div v-if="Object.keys(messages).length > 0">
                    <div v-for="(textm, index) in messages" :key="index">
                      <p
                        style="margin-bootm:2px;padding:10px;font-size:10px;border-bottom:1px solid #f4f4f4;"
                      >
                        <span style="color:green; font-family:sans serif;">
                          {{ textm.email }}
                        </span>
                        <br />
                        {{ textm.date }}
                        <br />
                        {{ textm.message }}
                      </p>
                    </div>
                  </div>
                  <div v-else>
                    <p class="alert alert-info text-small">
                      <i class="fa fa-info"></i> No new messages
                    </p>
                  </div>
                </div>
              </li>
              <li class="nav-item dropdown" v-if="isloggedin">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img
                    :src="`https://localhost:5000/${profile}`"
                    alt=""
                    width="25px;"
                    height="25px;"
                    class="img rounded-circle"
                  />
                </a>
                <div
                  class="dropdown-menu dropdown-menu-right"
                  aria-labelledby="navbarDropdown"
                >
                  <div>
                    <div>
                      <p
                        style="margin-bootm:2px;padding:10px;font-size:12px;border-bottom:1px solid #f4f4f4;text-align:center;"
                      >
                        <img
                          :src="`https://localhost:5000/${profile}`"
                          alt=""
                          width="50px;"
                          height="50px;"
                          class="img rounded-circle"
                        />

                        <a href="#">
                          <i
                            @click="updateProfile()"
                            class="fa fa-edit"
                            style="margin-left:-5px;color:red;font-size:15px;"
                          ></i>
                        </a>
                      </p>
                      <p
                        class="text-small"
                        style="font-size:12px;border-bottom:1px solid #f4f4f4;text-align:center;"
                      >
                        {{ loggedInEmail }} ( {{ loggedInRole }} )
                      </p>
                      <a
                        class="nav-link text-small"
                        style="text-align:center;"
                        href="#"
                        @click="logout"
                      >
                        <i
                          class="fa fa-sign-out btn btn-primary"
                          style="border-radius:8px;"
                        >
                          sign out</i
                        ></a
                      >
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
    <!-- home page begin-->
    <div v-if="flag == 0">
      <!-- Modal -->
      <div v-for="info in modalData" :key="info.id">
        <div
          class="modal fade"
          id="productView"
          tabindex="-1"
          role="dialog"
          aria-hidden="true"
        >
          <div
            class="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div class="modal-content">
              <div class="modal-body p-0">
                <div class="row align-items-stretch">
                  <div class="col-lg-6 p-lg-0">
                    <a
                      class="product-view d-block h-100 bg-cover bg-center"
                      title="Red digital smartwatch"
                    >
                      <img
                        :src="`https://localhost:5000/${info.image}`"
                        style="width:110%;height:100%;"
                    /></a>
                  </div>
                  <div class="col-lg-6">
                    <button
                      class="close p-4"
                      type="button"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                    <div class="p-5 my-md-4">
                      <ul class="list-inline mb-2">
                        <li class="list-inline-item m-0">
                          <i class="fa fa-star small text-warning"></i>
                        </li>
                        <li class="list-inline-item m-0">
                          <i class="fa fa-star small text-warning"></i>
                        </li>
                        <li class="list-inline-item m-0">
                          <i class="fa fa-star small text-warning"></i>
                        </li>
                        <li class="list-inline-item m-0">
                          <i class="fa fa-star small text-warning"></i>
                        </li>
                        <li class="list-inline-item m-0">
                          <i class="fa fa-star small text-warning"></i>
                        </li>
                      </ul>

                      <h2 class="h4">{{ info.pname }}</h2>
                      <p class="text-muted">{{ info.pprice }} Birr</p>
                      <p class="text-small mb-4">
                        {{ info.pdescription }}
                      </p>

                      <div
                        class="row align-items-stretch mb-4"
                        style="margin-left:10px;"
                      >
                        <div class="col-sm-5 pl-sm-0">
                          <a
                            class="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0"
                            href="#"
                            style="border-radius:6px;"
                            @click="
                              addToCart(
                                info.pid,
                                info.pname,
                                info.pprice,
                                info.user_id
                              )
                            "
                            >Add to cart</a
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          >
        </div>
      </div>
      <!-- end modal -->
      <div class="container">
        <div class="row">
          <div class="col-sm-3">
            <!-- side nav-->
            <div style="margin-top:100px;">
              <div class="order-2 order-lg-1">
                <h5 class="text-uppercase mb-4">Categories</h5>
                <div class="py-2 px-4 bg-dark text-white mb-3">
                  <a href="" style="text-decoration:none;">
                    <strong class="small text-uppercase font-weight-bold"
                      >Dealer
                      <i
                        class="fa fa-refresh"
                        style="color:#fff;float:right;"
                      ></i
                    ></strong>
                  </a>
                </div>
                <ul
                  class="list-unstyled small  pl-lg-4 font-weight-normal text-uppercase"
                  v-for="dealer in dealers"
                  :key="dealer.id"
                >
                  <li class="mb-2">
                    <a
                      href="#"
                      class="reset-anchor"
                      v-on:click="showSingle(dealer.companyname)"
                      ><i class="fa fa-list"></i> {{ dealer.companyname }}
                    </a>
                  </li>
                </ul>

                <div class="py-2 px-4 bg-light mb-3">
                  <strong
                    class="small text-uppercase font-weight-bold"
                    @click="realodpage"
                  >
                    Year
                  </strong>
                </div>
                <ul
                  class="list-unstyled small  pl-lg-4 font-weight-normal text-uppercase"
                  v-for="year in years"
                  :key="year.id"
                >
                  <li>
                    <div class="form-group">
                      <a
                        class="reset-anchor"
                        href="#"
                        @click="sortByYear(year.year)"
                      >
                        <i class="fa fa-list"></i>
                        {{ year.year }}
                      </a>
                    </div>
                  </li>
                </ul>
                <div class="py-2 px-4 bg-light mb-3">
                  <strong
                    class="small text-uppercase font-weight-bold"
                    @click="realodpage"
                  >
                    Location
                  </strong>
                </div>
                <ul
                  class="list-unstyled small  pl-lg-4 font-weight-normal text-uppercase"
                  v-for="location in countries"
                  :key="location.id"
                >
                  <li>
                    <div class="form-group">
                      <a
                        class="reset-anchor"
                        href="#"
                        @click="sortByCountry(location.pcountry)"
                      >
                        <i class="fa fa-list"></i>
                        {{ location.pcountry }}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- end side nav-->
          </div>

          <div class="col-sm-8">
            <!-- product list -->
            <div style="margin-top:100px;">
              <div class="order-1 order-lg-2 mb-5 mb-lg-0">
                <div class="row mb-3 align-items-center">
                  <div class="col-lg-6 mb-2 mb-lg-0">
                    <p class="text-small text-muted mb-0" v-if="count > 9">
                      Showing 1–9 of {{ count }} results
                    </p>
                    <p class="text-small text-muted mb-0" v-if="count <= 9">
                      Showing {{ count }} of {{ count }} results
                    </p>
                  </div>

                  <div class="col-lg-4">
                    <!-- Search form -->
                    <form class="example" id="searchbox">
                      <input
                        type="text"
                        placeholder="Search .."
                        class="form-control"
                        v-model="searchvalue"
                        v-on:keyup="homeSearch(searchvalue)"
                      />
                    </form>
                  </div>
                </div>
                <br />
                <br />
                <div class="row">
                  <div v-if="Object.keys(productList).length <= 0">
                    <p
                      class="small text-danger"
                      style="font-size:14px;margin-left:100px;margin-bottom:100px;"
                    >
                      <i
                        class="fa fa-exclamation-circle"
                        aria-hidden="true"
                      ></i>
                      Searching for {{ searchvalue }}
                      <br />
                      <span>Sorry, No Item Found </span>
                    </p>
                  </div>
                  <div v-if="count >= 1">
                    <!-- PRODUCT-->
                    <div
                      class="col-lg-4 col-sm-6"
                      style="display:inline-block"
                      v-for="product in productList"
                      :key="product.id"
                    >
                      <div class="product text-center">
                        <div class="mb-3 position-relative">
                          <div class="badge text-white badge-"></div>
                          <a class="d-block" href="#"
                            ><img
                              class="img-fluid w-100"
                              :src="`https://localhost:5000/${product.image}`"
                              product.image
                              alt="..."
                          /></a>
                          <div class="product-overlay">
                            <ul class="mb-0 list-inline">
                              <li
                                class="list-inline-item mr-0"
                                v-if="isdislike"
                              >
                                <a
                                  class="btn btn-sm btn-outline-dark"
                                  href="#"
                                  @click="dislike(product.pid)"
                                  ><i
                                    class="fa fa-thumbs-down"
                                    aria-hidden="true"
                                  ></i
                                ></a>
                              </li>
                              <li
                                class="list-inline-item mr-0"
                                v-if="!isdislike"
                              >
                                <a
                                  class="btn btn-sm btn-outline-dark"
                                  href="#"
                                  @click="likes(product.pid)"
                                  ><i class="fa fa-thumbs-o-up"></i
                                ></a>
                              </li>

                              <li class="list-inline-item m-0 p-0">
                                <a
                                  class="btn btn-sm btn-dark"
                                  style="color:#fff;"
                                  @click="
                                    addToCart(
                                      product.pid,
                                      product.pname,
                                      product.pprice,
                                      product.user_id
                                    )
                                  "
                                  >Add to cart</a
                                >
                              </li>
                              <li class="list-inline-item mr-0">
                                <a
                                  class="btn btn-sm btn-outline-dark"
                                  href="#productView"
                                  data-toggle="modal"
                                  data-target="#productView"
                                  @click="OpenModal(product.pcode)"
                                  ><i class="fa fa-expand"></i
                                ></a>
                              </li>
                            </ul>
                          </div>
                        </div>

                        <h6>
                          <a
                            href="#"
                            @click="showDetail(product.pcode)"
                            class="reset-anchor text-small"
                            >{{ product.pname }}</a
                          >
                        </h6>
                        <p class="small text-muted">
                          {{ product.pprice }} birr
                        </p>
                      </div>
                    </div>
                  </div>
                  <!-- end of product -->
                </div>
                <div v-if="Object.keys(productList).length > 9">
                  <!-- PAGINATION-->
                  <nav aria-label="Page navigation example">
                    <ul
                      class="pagination justify-content-center justify-content-lg-end"
                    >
                      <li class="page-item">
                        <a class="page-link" href="#" aria-label="Previous"
                          ><span aria-hidden="true">«</span></a
                        >
                      </li>
                      <li class="page-item active">
                        <a class="page-link" href="#">1</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#">2</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#">3</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" href="#" aria-label="Next"
                          ><span aria-hidden="true">»</span></a
                        >
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
            <!-- end product list -->
          </div>
        </div>
      </div>
    </div>
    <!-- end of home page -->

    <!-- cart section begin -->
    <div v-else-if="flag == 1">
      <!-- HERO SECTION-->

      <div class="container" style="padding-top:50px;">
        <section class="py-5">
          <h2 class="h5 text-uppercase text-small mb-4">
            Shopping cart
          </h2>

          <input type="hidden" v-model="cartid" id="cartid" />
          <div class="row">
            <div class="col-lg-8 mb-4 mb-lg-0">
              <p v-if="error" class="alert alert-danger">{{ error }}</p>
              <!-- CART TABLE-->
              <div v-if="Object.keys(cartItem).length >= 1">
                <div class="table-responsive mb-4">
                  <table class="table">
                    <thead class="bg-light">
                      <tr>
                        <th class="border-0" scope="col">
                          <strong class="text-small text-uppercase">#</strong>
                        </th>
                        <th class="border-0" scope="col">
                          <strong class="text-small text-uppercase"
                            >Product</strong
                          >
                        </th>
                        <th class="border-0" scope="col">
                          <strong class="text-small text-uppercase"
                            >Price</strong
                          >
                        </th>
                        <th class="border-0" scope="col">
                          <strong class="text-small text-uppercase"
                            >Quantity</strong
                          >
                        </th>
                        <th class="border-0" scope="col">
                          <strong class="text-small text-uppercase"
                            >Total</strong
                          >
                        </th>
                        <th class="border-0" scope="col"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, index) in cartItem" :key="index">
                        <td style="font-size:15px;">{{ index + 1 }}</td>
                        <td>
                          <div class="media align-items-center">
                            <a
                              class="reset-anchor d-block animsition-link"
                              href="#"
                              @click="showDetail()"
                              ><img
                                :src="`https://localhost:5000/${item.image}`"
                                alt="..."
                                width="70"
                            /></a>
                            <div class="media-body ml-3">
                              <strong class="h6"
                                ><a
                                  class="reset-anchor animsition-link"
                                  href="#"
                                  @click="showDetail()"
                                  >{{ item.itemname }}</a
                                ></strong
                              >
                            </div>
                          </div>
                        </td>
                        <td class="align-middle border-0 small text-muted">
                          <p class="mb-0 small" style="font-size:10px;">
                            <strong>{{ item.price }} birr</strong>
                          </p>
                        </td>

                        <td class="align-middle border-0 small text-muted">
                          <input
                            type="number"
                            :value="item.quantity"
                            class="text-muted"
                            :id="item.id"
                            @change="updateQuantity(item.id, item.itemid)"
                            @keyup="updateQuantity(item.id, item.itemid)"
                            style="width:60px;border:none;font-size:15px;"
                          />
                        </td>

                        <td class="align-middle border-0 small text-muted">
                          <p class="mb-0 small" style="font-size:10px;">
                            <strong
                              >{{ item.quantity * item.price }} birr</strong
                            >
                          </p>
                        </td>

                        <td class="align-middle border-0">
                          <a
                            class="reset-anchor"
                            href="#"
                            @click="removeFromCart(item.id)"
                            ><i class="fa fa-trash small text-muted"></i
                          ></a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div v-else>
                <p class="alert alert-info">
                  <i class="fa fa-cart-plus"> Empty Cart</i>
                </p>
              </div>

              <!-- CART NAV-->
              <div class="bg-light px-4 py-3">
                <div class="row align-items-center text-center">
                  <div class="col-md-6 mb-3 mb-md-0 text-md-left">
                    <a
                      class="btn btn-outline-dark btn-sm"
                      href="#"
                      @click="Gotohome()"
                      ><i class="fas fa-long-arrow-alt-left mr-2"> </i>Continue
                      shopping</a
                    >
                  </div>
                  <div
                    class="col-md-6 text-md-right"
                    v-if="Object.keys(cartItem).length >= 1"
                  >
                    <a class="btn btn-dark btn-sm" href="#" @click="checkout()"
                      >Procceed to checkout<i
                        class="fas fa-long-arrow-alt-right ml-2"
                      ></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>
            <!-- ORDER TOTAL-->
            <div class="col-lg-4" v-if="Object.keys(cartItem).length >= 1">
              <div class="card border-0 rounded-0 p-lg-4 bg-light">
                <div class="card-body">
                  <h5 class="text-small text-uppercase mb-4">Cart total</h5>
                  <ul class="list-unstyled mb-0">
                    <li class="border-bottom my-2"></li>
                    <li
                      class="d-flex align-items-center justify-content-between mb-4"
                    >
                      <strong class="text-uppercase small font-weight-bold"
                        >Total</strong
                      ><span class="small text-muted"
                        ><strong>{{ totalPrice[0].total }} birr</strong></span
                      >
                    </li>
                    <li>
                      <form action="#">
                        <div class="form-group mb-0">
                          <input
                            class="form-control"
                            type="text"
                            placeholder="Enter your coupon"
                          />
                          <br />
                          <button
                            class="btn btn-dark btn-sm btn-block"
                            type="submit"
                          >
                            <i class="fas fa-gift mr-2"></i>Apply coupon
                          </button>
                        </div>
                      </form>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div style="height:400px;"></div>
    </div>
    <!-- end cart section -->

    <!-- detail section begin -->
    <div v-else-if="flag == 2">
      <!-- just for spacing -->
      <div style="height:100px;"></div>
      <!-- PRODUCT DETAILS-->
      <section v-if="Object.keys(modalData).length">
        <div class="container">
          <div class="row">
            <div class="col-lg-6 ">
              <img
                :src="`https://localhost:5000/${modalData[0].image}`"
                width="100%"
              />
            </div>
            <div class="col-lg-6">
              <h1>{{ modalData[0].pname }}</h1>
              <p class="text-small mb-4">
                {{ modalData[0].pdescription }}
              </p>
              <div
                class="row align-items-stretch mb-4"
                style="margin-left:10px;"
              >
                <div class="col-sm-3 pl-sm-0">
                  <a
                    style="border-radius:6px;"
                    class="btn btn-dark btn-sm btn-block h-100 d-flex align-items-center justify-content-center px-0"
                    href="#"
                    @click="
                      addToCart(
                        modalData[0].pid,
                        modalData[0].pname,
                        modalData[0].pprice,
                        modalData[0].user_id
                      )
                    "
                    >Add to cart</a
                  >
                </div>
              </div>
              <ul class="list-unstyled small d-inline-block">
                <li class="px-3 py-2 mb-1 bg-white">
                  <strong class="text-uppercase">Price:</strong
                  ><span class="ml-2 text-muted"
                    >{{ modalData[0].pprice }} BR</span
                  >
                </li>
              </ul>
            </div>
          </div>
          <!-- DETAILS TABS-->
          <ul class="nav nav-tabs border-0" id="myTab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="description-tab"
                data-toggle="tab"
                href="#description"
                role="tab"
                aria-controls="description"
                aria-selected="true"
                >Description</a
              >
            </li>
          </ul>
          <div class="tab-content mb-5" id="myTabContent">
            <div
              class="tab-pane fade show active"
              id="description"
              role="tabpanel"
              aria-labelledby="description-tab"
            >
              <div class="p-4 p-lg-5 bg-white">
                <h6 class="text-uppercase">Product description</h6>
                <p class="text-muted text-small mb-0">
                  {{ modalData[0].pdescription }}
                </p>
              </div>
            </div>
          </div>
          <!-- RELATED PRODUCTS-->
          <h2 class="h5 text-uppercase mb-4">Related products</h2>
          <div class="row">
            <div>
              <div
                class="col-lg-3 col-sm-6"
                v-for="(item, index) in relatedProductList"
                :key="index"
                style="display:inline-block"
              >
                <div class="product text-center skel-loader">
                  <div class="d-block mb-3 position-relative">
                    <a class="d-block"
                      ><img
                        class="img-fluid w-100"
                        :src="`https://localhost:5000/${item.image}`"
                        alt="..."
                    /></a>
                    <div class="product-overlay">
                      <ul class="mb-0 list-inline">
                        <li
                          class="list-inline-item m-0 p-0"
                          style="width:300px;"
                        >
                          <a
                            class="btn btn-sm btn-dark"
                            style="color:#fff;border-radius:6px;width:125px;"
                            @click="
                              addToCart(
                                item.pid,
                                item.pname,
                                item.pprice,
                                item.user_id
                              )
                            "
                            >Add to cart</a
                          >
                        </li>
                      </ul>
                    </div>
                  </div>
                  <h6>
                    <a
                      href="#"
                      @click="showDetail(item.pcode)"
                      class="reset-anchor text-small"
                      >{{ item.pname }}</a
                    >
                  </h6>
                  <p class="small text-muted">{{ item.pprice }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- end product -->
        </div>
      </section>
    </div>
    <!-- detail section end -->

    <!-- checkout  section begin -->
    <div v-else-if="flag == 3">
      <div class="container">
        <section class="py-5">
          <!-- BILLING ADDRESS-->
          <h2
            class="h5 text-small text-uppercase mb-4"
            style="padding-top:50px;"
          >
            <i class="fa fa-info"></i> Billing details
          </h2>
          <div class="row">
            <div class="col-lg-8">
              <p v-if="success" class="alert alert-success">{{ success }}</p>
              <div class="row">
                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="firstName"
                    >Full name</label
                  >
                  <input
                    class="form-control form-control-lg"
                    v-model="order.fullname"
                    type="text"
                    placeholder="Enter Your Full Name"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="email"
                    >Email address</label
                  >
                  <input
                    class="form-control form-control-lg"
                    v-model="order.email"
                    type="email"
                    placeholder="e.g. kiya@example.com"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="phone"
                    >Phone number</label
                  >
                  <input
                    class="form-control form-control-lg"
                    v-model="order.phone"
                    type="number"
                    placeholder="e.g. +2519 02454045"
                  />
                </div>

                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase">City</label>
                  <select class="form-control" v-model="order.city">
                    <option value="">Select City</option>
                    <option value="Addis Abeba">Addis Abeba</option>
                    <option value="Nazrit">Nazrit</option>
                    <option value="Hawassa">Hawassa</option>
                  </select>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="phone"
                    >House number</label
                  >
                  <input
                    class="form-control form-control-lg"
                    v-model="order.housenum"
                    type="text"
                    placeholder="e.g. 096/09"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase">Wereda</label>
                  <select class="form-control" v-model="order.wereda">
                    <option value="03">04</option>
                    <option value="04">05</option>
                    <option value="05">06</option>
                  </select>
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase">Kebele</label>

                  <select class="form-control" v-model="order.kebele">
                    <option value="21">21</option>
                    <option value="14">14</option>
                    <option value="18">18</option>
                  </select>
                </div>

                <div class="col-lg-12 form-group">
                  <label class="text-small text-uppercase" for="desc"
                    >Description (optional)</label
                  >
                  <textarea
                    class="form-control form-control-lg"
                    v-model="order.desc"
                    type="text"
                    rows="3"
                    placeholder="Any addtional information "
                  />
                </div>
                <div class="col-lg-12 form-group">
                  <button class="btn btn-primary" @click="placeOrder()">
                    Place order
                  </button>
                  &nbsp; &nbsp;
                  <button class="btn btn-danger" @click="clearOrder()">
                    Clear
                  </button>
                </div>
              </div>
            </div>
            <!-- ORDER SUMMARY-->
            <div class="col-lg-4">
              <div class="card border-0 rounded-0 p-lg-4 bg-light">
                <div class="card-body">
                  <h5 class="text-uppercase mb-4">Your order</h5>
                  <ul
                    class="list-unstyled mb-0"
                    v-for="(item, index) in cartItem"
                    :key="index"
                  >
                    <li
                      class="d-flex align-items-center justify-content-between"
                    >
                      <strong class="small" style="font-size:12px;">{{
                        item.itemname
                      }}</strong
                      ><span class="small">{{ item.totalPrice }} birr</span>
                    </li>
                    <li class="border-bottom my-2"></li>
                  </ul>
                  <li class="d-flex align-items-center justify-content-between">
                    <strong class="text-uppercase  font-weight-bold"
                      >Total</strong
                    ><span>{{ totalPrice[0].total }} birr</span>
                  </li>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- checkout section end -->

    <!-- account section begin -->
    <div v-else-if="flag == 4" style="padding-top:100px;" class="text-center">
      <div class="container userform">
        <section>
          <div class="row">
            <div class="col-lg-2"></div>
            <div class="col-lg-7">
              <h5
                style="font-size:40px;margin-left:-350px;padding-bottom:30px; font-family:roboto"
              >
                Sign In
              </h5>
            </div>
          </div>

          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-5 form-group">
              <p v-if="error" class="alert alert-danger">{{ error }}</p>
              <form action="">
                <label class="text-uppercase" for="email" style="float:left;"
                  >E-mail</label
                >
                <input
                  class="form-control form-control-lg"
                  id="email"
                  type="email"
                  v-model.trim="login.email"
                  placeholder="Enter your E-mail"
                  required
                />
              </form>
            </div>
            <div class="col-lg-3"></div>
          </div>
          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-5  form-group">
              <form action="">
                <label class="text-uppercase" for="email" style="float:left;"
                  >Password</label
                >
                <input
                  class="form-control form-control-lg"
                  id="email"
                  type="password"
                  v-model.trim="login.password"
                  placeholder="Enter your Password"
                  required
                />
              </form>
            </div>
            <div class="col-lg-3"></div>
          </div>
          <div class="row">
            <div class="col-lg-3"></div>
            <div class="col-lg-2 col-sm-12 ">
              <div
                class="col-lg-3 form-group"
                style="margin-bottom:150px;margin-left:-10px;"
              >
                <input
                  @click="handdleLogin"
                  class="btn btn-primary text-small"
                  style="width:150px;color:#fff;border-radius:4px;"
                  type="submit"
                  value="Login"
                />
              </div>
            </div>
            <div class="col-lg-3">
              <a href="#" @click="forgotPass()">
                <p class="text-small">Forgot Password?</p></a
              >
            </div>
          </div>
          <br />
          <br />
          <br />
          <div class="row">
            <div class="col-lg-11" style="margin-top:-100px;">
              <p class="text-small">
                Don't have an account ?
                <a href="#" @click="gotoRegister">Register here</a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- end account section -->

    <!-- registeration section begin -->
    <div v-if="flag == 5">
      <div style="height:100px;"></div>
      <div class="container userform">
        <section>
          <div class="row">
            <div class="col-lg-8 ml-auto mr-auto">
              <h3 class="text-uppercase"><i class="fa fa-info"></i> Sign Up</h3>
              <p class="alert alert-success" v-if="success">
                {{ success }}
              </p>
              <p v-if="error" class="alert alert-danger">
                <i class="fa fa-warning"></i> {{ error }}
              </p>
              <br />
              <div class="row">
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="fname">First Name</label>
                  <input
                    class="form-control form-control-lg"
                    id="rgfname"
                    type="text"
                    v-model.trim="$v.userinformation.fname.$model"
                    placeholder="Enter your First Name"
                    :class="{
                      'is-invalid': $v.userinformation.fname.$error,
                      'is-valid': !$v.userinformation.fname.$invalid,
                    }"
                  />
                  <div class="valid-feedback">First Name is Valid</div>
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.fname.required"
                      >First name is required</span
                    >
                    <span v-if="!$v.userinformation.fname.minLength"
                      >First name can't be less than
                      {{ $v.userinformation.fname.$params.minLength.min }}
                      Character</span
                    >
                    <span v-if="!$v.userinformation.fname.maxLength"
                      >Fname can't be more than
                      {{ $v.userinformation.fname.$params.maxLength.max }}
                      Character</span
                    >
                  </div>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="lname">Last Name</label>
                  <input
                    class="form-control form-control-lg"
                    id="lname"
                    type="text"
                    v-model.trim="$v.userinformation.lname.$model"
                    placeholder="Enter your Last Name"
                    :class="{
                      'is-invalid': $v.userinformation.lname.$error,
                      'is-valid': !$v.userinformation.lname.$invalid,
                    }"
                  />
                  <div class="valid-feedback">Last Name is valid</div>
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.lname.required"
                      >Last name is required</span
                    >
                    <span v-if="!$v.userinformation.lname.minLength"
                      >Last name can't be Less than
                      {{ $v.userinformation.lname.$params.minLength.min }}
                      Character</span
                    >
                    <span v-if="!$v.userinformation.lname.maxLength"
                      >Last name can't be more than
                      {{ $v.userinformation.lname.$params.maxLength.max }}
                      Character</span
                    >
                  </div>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="email">E-mail</label>
                  <input
                    class="form-control form-control-lg"
                    id="email"
                    type="email"
                    v-model.trim="$v.userinformation.email.$model"
                    placeholder="Enter your E-mail"
                    :class="{
                      'is-invalid': $v.userinformation.email.$error,
                      'is-valid': !$v.userinformation.email.$invalid,
                    }"
                  />
                  <div class="valid-feedback">e-mail is valid</div>
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.email.required"
                      >e-mail is required</span
                    >
                    <span v-if="!$v.userinformation.email.minLength">
                      enter valid e-mail</span
                    >
                  </div>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small" for="lastName">Password</label>
                  <input
                    class="form-control form-control-lg"
                    id="password"
                    type="password"
                    v-model.trim="$v.userinformation.password.$model"
                    placeholder="Enter your Password"
                    :class="{
                      'is-invalid': $v.userinformation.password.$error,
                      'is-valid': !$v.userinformation.password.$invalid,
                    }"
                  />
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.password.required"
                      >password is required</span
                    >
                  </div>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="phone">Phone Number</label>
                  <input
                    class="form-control form-control-lg"
                    id="phone"
                    type="number"
                    v-model.trim="$v.userinformation.phone.$model"
                    placeholder="Enter your Phone Number"
                    :class="{
                      'is-invalid': $v.userinformation.phone.$error,
                      'is-valid': !$v.userinformation.phone.$invalid,
                    }"
                  />
                  <div class="valid-feedback">phone number is valid</div>
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.phone.required"
                      >phone number is required</span
                    >
                    <span v-if="!$v.userinformation.phone.minLength"
                      >phone number can't be less Than
                      {{ $v.userinformation.phone.$phone.minLength.min }}
                      Digit</span
                    >
                    <span v-if="!$v.userinformation.phone.maxLength"
                      >phone number can't be more than
                      {{ $v.userinformation.phone.$params.maxLength.max }}
                      Digit</span
                    >
                  </div>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="cname">Company Name</label>
                  <input
                    class="form-control form-control-lg"
                    id="cname"
                    type="text"
                    v-model.trim="$v.userinformation.cname.$model"
                    placeholder="Company name"
                    :class="{
                      'is-invalid': $v.userinformation.cname.$error,
                      'is-valid': !$v.userinformation.cname.$invalid,
                    }"
                  />
                  <div class="valid-feedback">Company name is valid</div>
                  <div class="invalid-feedback">
                    <span v-if="!$v.userinformation.cname.required"
                      >company name is required</span
                    >
                    <span v-if="!$v.userinformation.cname.minLength"
                      >at least
                      {{ $v.userinformation.cname.$params.minLength.min }}
                      Character</span
                    >
                    <span v-if="!$v.userinformation.cname.maxLength"
                      >at most
                      {{ $v.userinformation.cname.$params.maxLength.max }}
                      Character</span
                    >
                  </div>
                </div>
                <div class="col-lg-12 form-group">
                  <label class="text-small text-uppercase" for="desc"
                    >Description (optional)</label
                  >
                  <textarea
                    class="form-control form-control-lg"
                    id="desc"
                    name="desc"
                    type="text"
                    rows="3"
                    v-model.trim="$v.userinformation.desc.$model"
                    placeholder="Short Information About Your Company"
                  />
                </div>
                <div class="col-lg-4 form-group" style="margin-bottom:150px;">
                  <button
                    class="btn btn-primary text-small"
                    style="width:150px;color:#fff;border-radius:4px;"
                    type="button"
                    @click="register()"
                  >
                    Register
                  </button>
                </div>
                <div>
                  <a
                    href="javascript:void(0)"
                    style="float:right;color:green;"
                    class="text-small text-muted"
                    @click="account"
                  >
                    <p>
                      Already have an account?
                      <span style="color:orange;">Login here</span>
                    </p></a
                  >
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- registeration section end -->

    <!-- dashboard section begin -->
    <div v-if="flag == 6">
      <div class="container">
        <!--  dashboard section end -->
        <div
          v-if="
            menu == 'product' ||
              menu == 'dealer' ||
              menu == 'cart' ||
              menu == 'feedback' ||
              menu == 'log'
          "
        >
          <div style="height:100px;"></div>
          <div
            class="modal fade"
            id="productEdit"
            tabindex="-1"
            role="dialog"
            aria-hidden="true"
          >
            <div
              class="modal-dialog modal-lg"
              style="margin-top:100px;"
              role="document"
            >
              <div class="modal-content">
                <div class="modal-body p-0">
                  <div class="row">
                    <div class="col-lg-12">
                      <button
                        class="close p-4"
                        type="button"
                        data-dismiss="modal"
                        aria-label="Close"
                        style="margin-right:10px;"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                      <div class="p-5 ">
                        <h2 class="h4 bg-light" style="padding:10px;">
                          <i class="fa fa-edit text-small ">
                            update product information
                            <span style="color:red" class="text-small"
                              >(all are required )</span
                            >
                          </i>
                          <span
                            style="float:right;color:green;"
                            v-if="success"
                            >{{ success }}</span
                          >
                        </h2>
                        <div
                          v-for="(item, index) in modalProductUpdate"
                          :key="index"
                        >
                          <form
                            action="https://localhost:5000/products/productedit"
                            method="post"
                            enctype="multipart/form-data"
                            target="myframe"
                          >
                            <div class="row updateproduct">
                              <div class="col-sm-12">
                                <div class="row">
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="pname"
                                      :value="item.pname"
                                      placeholder="Item Name"
                                      class="form-control"
                                    />
                                    <input
                                      type="text"
                                      name="pmodel"
                                      :value="item.pmodel"
                                      placeholder="Item Model"
                                      class="form-control"
                                    />
                                    <input
                                      type="number"
                                      name="quantity"
                                      :value="item.totalQ"
                                      placeholder="Quantity"
                                      class="form-control"
                                    />
                                    <select
                                      class="form-control"
                                      name="country"
                                      style="margin-left:10px;"
                                    >
                                      <option :value="item.pcountry">{{
                                        item.pcountry
                                      }}</option>
                                      <option value="USA">Usa</option>
                                      <option value="JAPAN">Japan</option>
                                      <option value="GERMENY">Germany</option>
                                    </select>
                                    <input
                                      type="file"
                                      placeholder="Item Price"
                                      name="photo"
                                      class="form-control"
                                    />
                                  </div>
                                  <div class="col-lg-6">
                                    <input
                                      type="text"
                                      name="pcode"
                                      :value="item.pcode"
                                      placeholder="Item Code"
                                      class="form-control"
                                    />
                                    <input
                                      type="text"
                                      name="pmake"
                                      :value="item.make"
                                      placeholder="Year Of Make"
                                      class="form-control"
                                    />
                                    <input
                                      type="number"
                                      name="pprice"
                                      :value="item.pprice"
                                      placeholder="Price"
                                      class="form-control"
                                    />
                                    <Datepicker
                                      type="year"
                                      :format="DatePickerFormat"
                                      :language="language"
                                      minimum-view="year"
                                      name="year"
                                      :value="item.year"
                                      id="input-id"
                                      input-class="form-control"
                                      style="margin-left:20px;"
                                    />
                                    <input
                                      type="number"
                                      name="pid"
                                      :value="item.pid"
                                      class="form-control"
                                    />
                                  </div>

                                  <textarea
                                    class="form-control form-control-lg"
                                    id="desc"
                                    name="pdesc"
                                    type="text"
                                    :value="item.pdescription"
                                    rows="3"
                                    placeholder="Information about the product"
                                  />
                                  <input
                                    type="submit"
                                    value="Update"
                                    class="btn btn-primary"
                                    @click="showsuccess()"
                                  />
                                  <input
                                    type="submit"
                                    value="Cancel"
                                    class="btn btn-danger"
                                  />
                                </div>
                              </div>
                            </div>
                          </form>
                        </div>
                        <iframe
                          name="myframe"
                          width="0"
                          height="0"
                          border="0"
                          style="display:none;"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            >
          </div>
          <div class="col-sm-12 col-lg-12">
            <nav class="nav text-small" id="dash">
              <a
                class="nav-link active"
                aria-current="page"
                href="#"
                @click="showProducts()"
                ><strong class="text-small"
                  ><i class="fa fa-list"></i> PRODUCTS</strong
                ></a
              >
              <a
                class="nav-link"
                href="#"
                @click="showDealer()"
                id="saller"
                v-if="isadmin"
                ><strong class="text-small"
                  ><i class="fa fa-list"></i> DEALERS</strong
                ></a
              >
              <a
                class="nav-link"
                href="#"
                v-if="!isadmin"
                @click="showProductForm()"
                ><i class="fa fa-edit"></i>
                <strong class="text-small"> ADD PRODUCTS</strong></a
              >
              <a class="nav-link" href="#" v-if="!isadmin" @click="showCart()"
                ><i class="fa fa-cart-plus"></i>
                <strong class="text-small"> CART</strong></a
              >
              <a class="nav-link" href="#" v-if="isadmin" @click="log()">
                <strong class="text-small">
                  <i class="fa fa-list"></i> LOG
                </strong></a
              >
              <a class="nav-link" href="#" @click="feedback()"
                ><i class="fa fa-notification"></i>
                <strong class="text-small">
                  <i class="fa fa-comments-o"></i> FEEDBACK
                </strong></a
              >
              <a href="javascript:void(0)" v-if="menu != 'feedback'">
                <input
                  type="text"
                  placeholder="Search ..."
                  class="form-control fa fa-search"
                  v-model="searchvalue"
                  autocomplete="off"
                  id="search"
                  width="200px;"
                  @keyup="searchProducts(searchvalue)"
                />
              </a>
              <a href="" class="text-small" id="res" v-if="menu != 'feedback'">
                Showing {{ count }} of {{ count }} results</a
              >

              <a
                v-if="menu != 'feedback'"
                href="#"
                style="margin-left:20px;color:green;"
                @click="referesh()"
              >
                <i class="fa fa-refresh"></i
              ></a>
            </nav>
          </div>
        </div>
        <div v-if="menu == 'product'">
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-12">
                <div id="page-content-wrapper">
                  <div v-if="count >= 1">
                    <table class="table table-hover table-striped" id="table">
                      <div id="table">
                        <thead class="bg-light">
                          <tr>
                            <th><strong>#</strong></th>
                            <th><strong class="text-small">NAME</strong></th>
                            <th><strong class="text-small">CODE</strong></th>
                            <th><strong class="text-small">PRICE</strong></th>
                            <th><strong class="text-small">MODEL</strong></th>
                            <th><strong class="text-small">YEAR</strong></th>
                            <th><strong class="text-small">COUNTRY</strong></th>
                            <th><strong class="text-small">DEALER</strong></th>
                            <th>
                              <strong class="text-small">DESCRIPTION</strong>
                            </th>
                            <th><strong class="text-small">TOTAL</strong></th>
                            <th><strong class="text-small">lEFT</strong></th>
                            <th v-if="!isadmin">
                              <strong class="text-small">STATUS</strong>
                            </th>
                            <th v-if="!isadmin"></th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(product, index) in products" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ product.pname }}</td>
                            <td>{{ product.pcode }}</td>
                            <td>{{ product.pprice }}</td>
                            <td>{{ product.pmodel }}</td>
                            <td>{{ product.year }}</td>
                            <td>{{ product.pcountry }}</td>
                            <td>{{ product.companyname }}</td>
                            <td class="alert alert-info">
                              {{ product.pdescription }}
                            </td>
                            <td>{{ product.totalQ }}</td>
                            <td>{{ product.leftQ }}</td>
                            <td
                              v-if="!isadmin"
                              @click="
                                productStatus(product.pid, product.status)
                              "
                            >
                              <div v-if="product.status == 1">
                                <input type="checkbox" checked />
                              </div>
                              <div v-else>
                                <input type="checkbox" value="0" />
                              </div>
                            </td>
                            <td v-if="loggedInRole != 'admin'">
                              <a
                                href="#productEdit"
                                data-toggle="modal"
                                data-target="#productEdit"
                                @click="updateProduct(product.pid)"
                              >
                                <i class="fa fa-edit"></i
                              ></a>
                            </td>
                            <td
                              v-if="!isadmin"
                              @click="deleteProduct(product.pid)"
                            >
                              <i
                                class="fa fa-trash btn btn-danger"
                                style="border-radius:6px;"
                              ></i>
                            </td>
                          </tr>
                        </tbody>
                      </div>
                    </table>
                  </div>
                  <div v-else>
                    <div>
                      <h5 class="alert alert-danger">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        No data To Show
                      </h5>
                      <p class="alert alert-info">
                        Searching for:{{ searchvalue }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else-if="menu == 'dealer'">
          <br />
          <div v-if="count >= 1">
            <table class="table-wrapper table table-striped table-hover">
              <div id="table">
                <thead>
                  <tr>
                    <th><strong class="text-small">#</strong></th>
                    <th><strong class="text-small">FIRST NAME</strong></th>
                    <th><strong class="text-small">LAST NAME</strong></th>
                    <th><strong class="text-small">E-MAIL</strong></th>
                    <th><strong class="text-small">PHONE</strong></th>
                    <th><strong class="text-small">COMPANY</strong></th>
                    <th><strong class="text-small">DESCRIPTION</strong></th>
                    <th><strong class="text-small">ROLE</strong></th>
                    <th><strong class="text-small">STATUS</strong></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody class="text-small" id="list">
                  <tr v-for="(user, index) in userList" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                      {{ user.fname }}
                    </td>
                    <td>
                      {{ user.lname }}
                    </td>
                    <td class=" text-small">
                      {{ user.email }}
                    </td>
                    <td>
                      {{ user.phone }}
                    </td>
                    <td>
                      {{ user.companyname }}
                    </td>
                    <td class="alert alert-info text-small">
                      {{ user.description }}
                    </td>
                    <td>
                      <select @change="updateRole(user.id)" id="role">
                        <option :value="user.role">{{ user.role }}</option>
                        <!-- <option value="admin">admin</option>
                        <option value="dealer">dealer</option> -->
                      </select>
                    </td>
                    <td @click="editStatus(user.id, user.status)">
                      <div v-if="user.status == 1">
                        <input type="checkbox" checked />
                      </div>
                      <div v-else>
                        <input type="checkbox" value="0" />
                      </div>
                    </td>
                    <td @click="remove(user.id)">
                      <a href="#">
                        <i
                          class="fa fa-trash btn btn-danger"
                          style="border-radius:4px;"
                        ></i
                      ></a>
                    </td>
                  </tr>
                </tbody>
              </div>
            </table>
          </div>
          <div v-else>
            <div>
              <h5 class="alert alert-danger">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                No data To Show
              </h5>
              <p class="alert alert-info">Searching for:{{ searchvalue }}</p>
            </div>
          </div>
        </div>
        <div v-if="menu == 'cart'">
          <div class="container">
            <div v-if="Object.keys(soldproducts).length >= 1">
              <!-- sold section  -->
              <section class="py-5">
                <h2 class="h5 text-uppercase text-small mb-4 ml-3">
                  Sold Products
                </h2>
                <input type="hidden" v-model="cartid" id="cartid" />
                <div class="row">
                  <div class="col-lg-12 mb-lg-0">
                    <!-- CART TABLE-->

                    <div class="table-responsive">
                      <table class="table table-hover" id="exportTable">
                        <div id="cart">
                          <thead class="bg-light">
                            <tr>
                              <th class="border-0" scope="col">
                                <strong class="text-small">#</strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">ITEM</strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small">PRICE</strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">QUANTITY</strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">TOTAL</strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small">
                                  CLIENT
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">
                                  PHONE
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">
                                  E-MAIL
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">
                                  CITY
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">
                                  We/Ke
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <strong class="text-small ">
                                  HOUSE
                                </strong>
                              </th>
                              <th class="border-0" scope="col">
                                <i class="fa fa-check"></i>
                              </th>
                              <th
                                class="border-0"
                                scope="col"
                                @click="exportTable()"
                              >
                                <a href="#"> <i class="fa fa-download"></i></a>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr
                              v-for="(soldItem, index) in soldproducts"
                              :key="index"
                            >
                              <td>{{ index + 1 }}</td>
                              <td>
                                <strong class="text-small"
                                  >{{ soldItem.itemname }}
                                </strong>
                              </td>
                              <td
                                class="align-middle border-0 small text-muted"
                              >
                                <p class="mb-0 small">
                                  {{ soldItem.price }} birr
                                </p>
                              </td>

                              <td class="align-middle border-0">
                                <input
                                  class="small form-control"
                                  style="width:50px;"
                                  type="number"
                                  disabled
                                  :value="soldItem.quantity"
                                />
                              </td>

                              <td
                                class="align-middle border-0 small text-muted"
                              >
                                <p class="mb-0 small">
                                  {{ soldItem.totalPrice }} birr
                                </p>
                              </td>
                              <td
                                class="align-middle border-0 small text-muted"
                              >
                                {{ soldItem.customer }}
                              </td>
                              <td>{{ soldItem.phone }}</td>
                              <td>{{ soldItem.email }}</td>
                              <td>{{ soldItem.city }}</td>
                              <td>
                                {{ soldItem.wereda }} / {{ soldItem.kebele }}
                              </td>
                              <td>{{ soldItem.housenumber }}</td>

                              <td
                                @click="
                                  CartProductStatus(
                                    soldItem.id,
                                    soldItem.quantity,
                                    soldItem.delivered
                                  )
                                "
                              >
                                <div v-if="soldItem.delivered == 1">
                                  <input type="checkbox" checked />
                                </div>
                                <div v-else>
                                  <input type="checkbox" />
                                </div>
                              </td>

                              <td>
                                <a
                                  href="#"
                                  @click="
                                    NotSold(
                                      soldItem.itemname,
                                      soldItem.quantity,
                                      soldItem.delivered,
                                      soldItem.id
                                    )
                                  "
                                >
                                  <i class="fa fa-trash"></i
                                ></a>
                              </td>
                            </tr>
                          </tbody>
                        </div>
                      </table>
                    </div>
                  </div>
                </div>
              </section>
              <!-- end sold section -->
            </div>
            <div v-else>
              <br />
              <div class="col-sm-6">
                <p class="alert alert-danger">
                  <i class="fa fa-info-circle"></i> There is no sold item to
                  show with
                  <span style="color:blue"> {{ searchvalue }}</span> key
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="menu == 'productForm'">
          <div style="height:90px;"></div>
          <div class="container">
            <!-- add product form start-->

            <h5 class="text-small  alert alert-info">
              <i
                class="fa fa-arrow-circle-left btn btn-info "
                style="border-radius:6px;"
                @click="showProducts()"
              ></i>
              Product Information
              <span style="color:red">(all are required fields)</span>
              <span
                v-if="userStatus == 0"
                style="float:right;color:red;"
                class="text-small"
              >
                <i class="fa fa-warning"></i> You can't add product any more,
                contact the adminstrator more!</span
              >
            </h5>

            <form
              action="https://localhost:5000/products/add"
              method="post"
              enctype="multipart/form-data"
              target="hiddenFrame"
            >
              <div class="row">
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="iname"
                    >Item Name</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="iname"
                    name="iname"
                    type="text"
                    placeholder="Enter Item Name"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase " for="icode"
                    >Item Code</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="icode"
                    name="icode"
                    type="text"
                    placeholder="Enter Item Code"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="model"
                    >Item Model</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="model"
                    name="model"
                    type="text"
                    placeholder="Enter Item Model"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="company"
                    >Make</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="make"
                    type="text"
                    name="make"
                    placeholder="Make"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="company"
                    >Quantity</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="quantity"
                    type="number"
                    name="quantity"
                    placeholder="Item Quantity"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="company"
                    >Item Price</label
                  >
                  <input
                    class="form-control form-control-lg"
                    id="price"
                    type="number"
                    name="price"
                    placeholder="Enter Item Price"
                  />
                </div>
                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="lastName"
                    >Year</label
                  >
                  <Datepicker
                    type="year"
                    :format="DatePickerFormat"
                    :language="language"
                    minimum-view="year"
                    name="datepicker"
                    id="input-id"
                    input-class="form-control"
                  />
                </div>

                <div class="col-lg-3 form-group">
                  <label class="text-small text-uppercase" for="email">
                    Dealer ID</label
                  >
                  <select class="form-control" name="dealer" id="dealer">
                    <option :value="userId">{{ userId }}</option>
                  </select>
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="phone"
                    >Country</label
                  >
                  <select class="form-control" name="country" id="country">
                    <option value="Select Country">Select country</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Canada">Canada</option>
                    <option value="Japan">Japan</option>
                  </select>
                </div>

                <div class="col-lg-6 form-group">
                  <label class="text-small text-uppercase" for="image"
                    >Image</label
                  >
                  <input
                    id="image"
                    type="file"
                    name="image"
                    class="form-control form-control-lg"
                  />
                </div>
                <div class="col-lg-12 form-group">
                  <label class="text-small text-uppercase" for="state"
                    >Description (optional)</label
                  >
                  <textarea
                    class="form-control form-control-lg"
                    id="desc"
                    name="desc"
                    type="text"
                    rows="3"
                    placeholder="Information about the product"
                  />
                </div>
                <div class="col-lg-12 form-group ">
                  <div v-if="userStatus != 0">
                    <input
                      type="submit"
                      class="btn btn-success"
                      style="width:95px;color:#fff;border-radius:4px;margin-left:20px;"
                      value="Save"
                    />
                    <button
                      class="btn btn-danger"
                      style="margin-left:30px;border-radius:6px;"
                      @click="clearField()"
                    >
                      <i class="fa fa-trash-o"></i>
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <iframe
              name="hiddenFrame"
              width="0"
              height="0"
              border="0"
              style="display:none;"
            ></iframe>
            <!-- add product form end -->
          </div>
        </div>
        <div v-if="menu == 'feedback'">
          <div class="row">
            <div
              class="col-sm-3"
              id="users"
              style="margin-left:20px;"
              v-if="loggedInRole == 'admin'"
            >
              <div
                class=" bg-light"
                style="padding:10px;margin-bottom:10px;border-radius:10px;"
              >
                <h2><i class="fa fa-comments-o"></i> chats List</h2>
              </div>
              <div v-for="(user, index) in dealers" :key="index">
                <p
                  @click="
                    viewChat(
                      user.email,
                      user.fname,
                      user.lname,
                      user.companyname,
                      user.photo
                    )
                  "
                >
                  <img
                    :src="`https://localhost:5000/${user.photo}`"
                    alt=""
                    width="25px;"
                    height="25px;"
                    class="img rounded-circle"
                  />
                  {{ user.fname }} {{ user.lname }}
                </p>
              </div>
            </div>
            <div class="col-sm-3" v-if="loggedInRole != 'admin'">
              <div
                class=" bg-light"
                style="padding:10px;margin-bottom:10px;border-radius:10px;"
              >
                <h2><i class="fa fa-comments-o"></i> chats List</h2>
              </div>
              <p
                style=" cursor:pointer; text-transform: capitalize;margin-left:20px;"
                class="text-muted"
              >
                <img
                  :src="`https://localhost:5000/${adminuser[0].photo}`"
                  style="width:30px;height:30px;"
                  class="img rounded-circle"
                />
                {{ adminuser[0].fname }} {{ adminuser[0].lname }}
              </p>
            </div>
            <div class="col-sm-6 ">
              <div
                class=" bg-light"
                style="padding:10px;margin-bottom:10px;border-radius:10px;"
              >
                <div v-if="loggedInRole == 'admin'">
                  <h5 style=" text-transform: capitalize;" class="text-muted">
                    <img
                      v-if="currentChat != ''"
                      :src="`https://localhost:5000/${pic}`"
                      style="width:30px;height:30px;"
                      class="img rounded-circle"
                    />
                    {{ currentChat }}
                    <span style="float:right;font-size:10px;">{{ org }}</span>
                  </h5>
                </div>
                <div v-else>
                  <h5 style=" text-transform: capitalize;" class="text-muted">
                    <img
                      v-if="currentChat != ''"
                      :src="`https://localhost:5000/${adminuser[0].photo}`"
                      style="width:30px;height:30px;"
                      class="img rounded-circle"
                    />
                    {{ currentChat }}
                    <span style="float:right;font-size:10px;">{{ org }}</span>
                    <span
                      v-if="loggedInRole != 'admin'"
                      style="float:right;font-size:10px;"
                    >
                      {{ adminuser[0].companyname }}
                    </span>
                  </h5>
                </div>

                <input type="text" :value="to" hidden />
              </div>
              <div id="chats" class="scroll">
                <div v-if="Object.keys(chats).length >= 1 && currentChat != ''">
                  <div v-for="(chat, index) in chats" :key="index">
                    <div>
                      <p class="text-small">
                        <img
                          :src="`https://localhost:5000/${chat.photo}`"
                          style="width:30px;height:30px;"
                          class="img rounded-circle"
                        />
                        {{ chat.message }}
                        <br />
                        <span style="font-size:10px;" class="text-muted">
                          {{ chat.at }}</span
                        ><span
                          class="text-muted"
                          style="float:right;font-size:9px;"
                          >seen</span
                        >
                      </p>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <p
                    class="bg-light alert alert-info"
                    style="text-align:center;margin-top:50px;"
                  >
                    No Coversation yet!
                  </p>
                </div>
              </div>
              <div class="row ">
                <div class="col-sm-10 " id="chattxt">
                  <textarea
                    class="form-control form-control-lg"
                    id="message"
                    v-model="mymessage"
                    type="text"
                    rows="3"
                    placeholder="Type Your Message"
                  />
                </div>
                <div class="col-sm-1">
                  <i
                    @click="sendFeedback(mymessage)"
                    class="fa fa-paper-plane"
                    style="margin-top:20px;margin-left:-25px;cursor:pointer;font-size:40px;color:lightblue;;"
                  ></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="menu == 'log'">
          <div class="container-fluid">
            <div class="row">
              <div class="col-sm-12">
                <div id="page-content-wrapper">
                  <div v-if="count >= 1">
                    <table class="table table-hover table-striped" id="table">
                      <div id="table">
                        <thead class="bg-light">
                          <tr>
                            <th><strong>#</strong></th>
                            <th>
                              <strong class="text-small">Activity</strong>
                            </th>
                            <th>
                              <strong class="text-small">User Agent</strong>
                            </th>
                            <th>
                              <strong class="text-small">Duration</strong>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(log, index) in logList" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ log.action }}</td>
                            <td>{{ log.FromDevice }}</td>
                            <td>{{ log.timeAction }}</td>
                          </tr>
                        </tbody>
                      </div>
                    </table>
                  </div>
                  <div v-else>
                    <div>
                      <h5 class="alert alert-danger">
                        <i
                          class="fa fa-exclamation-circle"
                          aria-hidden="true"
                        ></i>
                        No data To Show
                      </h5>
                      <p class="alert alert-info">
                        Searching for:{{ searchvalue }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--  dashboard section end -->
    <!-- contact us section begin -->
      <div v-if="flag == 7">
      <div class="Container">
        <div class="row">
          <div class="col-sm-3"></div>

          <div class="col-sm-6" id="contactmessage">
            <h1 class="text-uppercase" style="margin-top:100px;">Contact Us</h1>
            <p class="alert alert-success" v-if="!iserror">
              Thank you for your comment
            </p>
            <p v-if="error" class="alert alert-danger">
              <i class="fa fa-warning"></i> {{ error }}
            </p>
            <input
              class="form-control form-control-lg"
              v-model="contactus.email"
              type="email"
              placeholder="@example.com"
              autocomplete="off"
              required
            />
            <textarea
              class="form-control form-control-lg"
              autocomplete="off"
              v-model="contactus.message"
              rows="4"
              placeholder="Type your message ..."
              required
            ></textarea>
            <div class="col-lg-12 form-group">
              <button
                class="btn btn-primary"
                style="width:100px;color:#fff;border-radius:4px;margin-top:20px;margin-bottom:20px;float:right;"
                v-on:click="registerComment()"
              >
                Send
              </button>
            </div>
          </div>
          <div class="col-sm-3"></div>
          <div class="col-sm-12">
            <div class="mapouter">
              <div class="gmap_canvas">
                <iframe
                  width="100%"
                  height="300"
                  id="gmap_canvas"
                  src="https://maps.google.com/maps?q=Ethiopia%20bole&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  frameborder="0"
                  scrolling="no"
                  marginheight="0"
                  marginwidth="0"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- contact us section end -->
     <!-- likes & deslikes begin -->
    <div v-if="flag == 8">
      <br />
      <br />
      <br />
      <div class="container">
        <table class="table">
          <tbody>
            <br />
            <p class="fa fa-info-circle">Most Liked Products</p>
            <tr v-for="(like, index) in likedProduct" :key="index">
              <td>
                <a href="/">
                  <img
                    :src="`https://localhost:5000/${like.image}`"
                    alt="..."
                    width="70"
                  />
                </a>
                <!--   <i class="fa fa-star small text-warning"></i> -->
              </td>
              <td>{{ like.pname }}</td>

              <div v-if="like.likes >= 10">
                <td>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                  <i class="fa fa-star small text-warning"></i>
                </td>
              </div>
              <div v-else>
                <i class="fa fa-star small text-warning"></i>
                <i class="fa fa-star small text-warning"></i>
                <i class="fa fa-star small text-warning"></i>
                <i class="fa fa-star small text-warning"></i>
                <i class="fa fa-star small text-warning"></i>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
      <!-- likes & deslikes end -->


    <!-- rest password begin -->
    <div v-if="flag == 9">
      <div class="container">
        <br />
        <br />
        <br />
        <br />
        <div class="row">
          <div class="col-sm-3"></div>
          <div class="col-sm-6  form-group">
            <label class="text-uppercase" for="email" style="float:left;"
              >Reset Password</label
            >

            <input
              class="form-control form-control-lg"
              id="email"
              type="email"
              v-model.trim="resetMail"
              placeholder="Enter your E-mail"
              required
            />
            <button
              @click="resetPassword(resetMail)"
              class="btn btn-primary "
              style="margin-top:20px;color:#fff;"
            >
              Get New Password
            </button>
          </div>
          <div class="col-sm-3"></div>
        </div>
      </div>
    </div>
    <!-- blog begin -->
    <div v-if="flag == 10">
      <div class="container">
        <div class="col-sm-12">
          <br />
          <br />
          <br />
          <br />
          <h3 class="alert alert-info">Notice</h3>
          <p v-if="success" class="alert alert-success">{{ success }}</p>
          <div v-for="(notice, index) in noticeList" :key="index">
            <h4>{{ notice.title }}</h4>
            <p class="text-muted" style="font-size:10px;">{{ notice.time }}</p>
            <p style="background-color:lightyellow">
              {{ notice.body }}
              <a href="#" @click="deletenotice(notice.id)" style="float:right;">
                <i class="fa fa-remove"></i
              ></a>
            </p>
          </div>
        </div>
        <div class="col-sm-8" v-if="loggedInRole == 'admin'">
          <input
            type="text"
            placeholder="Title"
            class="form-control"
            v-model="title"
          />
          <textarea
            class="form-control form-control-lg"
            autocomplete="off"
            v-model="mBody"
            rows="4"
            placeholder="Type your message ..."
            style="margin-top:10px;"
            required
          ></textarea>
          <button
            class="btn btn-danger"
            style="width:100px;color:#fff;border-radius:4px;margin-top:20px;margin-bottom:20px;float:right;"
            @click="postNotice()"
          >
            POST
          </button>
        </div>
      </div>
    </div>
    <!-- blog end -->
    <!-- reset password ends -->
    <!-- edit profile -->
    <div v-if="flag == 11">
      <div class="container userform" style="padding-top:90px;">
        <section>
          <div class="row">
            <div class="col-lg-8 ml-auto mr-auto">
              <h5 class="text-uppercase">
                <i class="fa fa-edit"></i> Edit Profile
              </h5>
              <br />

              <div class="row">
                <div class="col-sm-6">
                  <div class="col-lg-6 form-group">
                    <img
                      :src="`https://localhost:5000/${profile}`"
                      alt=""
                      width="150px;"
                      height="150px;"
                      class="img rounded-circle"
                      style="margin-bottom:20px;"
                    />
                    <form
                      action="https://localhost:5000/users/editprofile"
                      method="post"
                      target="editprofile"
                      enctype="multipart/form-data"
                    >
                      <div class="form-group">
                        <input
                          type="text"
                          name="email"
                          :value="loggedInEmail"
                          hidden
                        />
                        <input type="file" name="profile" />
                        <button
                          type="submit"
                          class="btn btn-primary form-control"
                          style="margin-top:10px;"
                        >
                          <i class="fa fa-save"></i> Save
                        </button>
                      </div>
                    </form>
                    <iframe
                      name="editprofile"
                      width="0"
                      height="0"
                      border="0"
                      style="display:none;"
                    ></iframe>
                  </div>
                </div>
                <div class="col-sm-6">
                  <h4 class="text-uppercase">Auto Bridge</h4>
                  <p>
                    {{ edit.desc }}
                  </p>
                  <p class="text-muted">
                    <strong>{{ loggedInEmail }}</strong>
                  </p>
                </div>
              </div>

              <br />
              <h5 class="text-uppercase">
                <i class="fa fa-edit"></i> Personal Information
                <span
                  ><input
                    type="checkbox"
                    v-model="pInfoToggle"
                    @click="togglePinfo()"
                  />
                </span>
              </h5>
              <p v-if="success" class="alert alert-success">
                {{ success }}
              </p>

              <p v-if="error" class="alert alert-danger">
                <i class="fa fa-warning"></i> {{ error }}
              </p>
              <div class="row" id="personalinfo" v-if="pInfoToggle == true">
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="fname">First Name</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.fname"
                    type="text"
                    placeholder="Enter your First Name"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="lname">Last Name</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.lname"
                    type="text"
                    placeholder="Enter your Last Name"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="email">E-mail</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.email"
                    type="email"
                    placeholder="Enter your E-mail"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-small" for="lastName">Old Password</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.oldpass"
                    type="password"
                    placeholder="Enter old Password"
                  />
                  <label class="text-small" for="lastName">New Password</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.newpass"
                    type="password"
                    placeholder="Enter new Password"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="phone">Phone Number</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.phone"
                    type="number"
                    placeholder="Enter your Phone Number"
                  />
                </div>
                <div class="col-lg-6 form-group">
                  <label class="text-uppercase" for="cname">Company Name</label>
                  <input
                    class="form-control form-control-lg"
                    v-model="edit.cname"
                    type="text"
                    placeholder="Company name"
                  />
                </div>
                <div class="col-lg-12 form-group">
                  <label class="text-small text-uppercase" for="desc"
                    >Description (optional)</label
                  >
                  <textarea
                    class="form-control form-control-lg"
                    v-model="edit.desc"
                    name="desc"
                    type="text"
                    rows="3"
                    placeholder="Short Information About Your Company"
                  />
                </div>
                <div class="col-lg-5 form-group" style="margin-bottom:150px;">
                  <button
                    class="btn btn-primary text-small"
                    style="color:#fff;border-radius:4px;"
                    type="button"
                    @click="editprofile()"
                  >
                    Save Changes
                  </button>
                  <button
                    class="btn btn-secondary text-small"
                    style="color:#fff;border-radius:4px;float:right"
                    type="button"
                    @click="cancel()"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
    <!-- edit profile -->

    <Footer style="margin-top:250px;postion:fixed" />
  </div>
</template>

<script>
//components
import {
  minLength,
  maxLength,
  email,
  required,
} from "vuelidate/lib/validators";
import Footer from "@/components/Footer.vue";
import productservice from "../../services/productService";
import userService from "../../services/userService";
import axios from "axios";
import swal from "sweetalert";
import Datepicker from "vuejs-datepicker";
import TableExport from "tableexport";
//import $ from "jquery";
export default {
  name: "Home",
  components: {
    Footer,
    Datepicker,
  },
  data() {
    return {
      soldproducts: [],
      //login field
      login: {
        email: "",
        password: "",
      },
      title: "",
      resetMail: "",
      mBody: "",
      noticeList: [],
      adminuser: [],
      mymessage: "",
      isdislike: false,
      order: {
        fullname: "",
        email: "",
        phone: "",
        housenum: "",
        city: "",
        wereda: "",
        kebele: "",
        desc: "",
      },
      currentChat: "Administrator",
      to: "",
      pic: "",
      totalPrice: 0,
      userId: "",
      userStatus: "",
      isloggedin: false,
      isadmin: false,
      iserror: true,
      loggedInEmail: "",
      loggedInRole: "",
      profile: "",
      error: "",
      success: "",
      cart: 0,
      likedProduct: [],
      count: 0,
      searchvalue: "",
      productList: [], //admin
      relatedProductList: [],
      products: [], //dealer
      userList: [],
      modalData: [],
      modalProductUpdate: [],
      messages: [],
      mcount: 0,
      type: "all",
      dealers: [],
      specificDealer: [],
      chats: [],
      years: [],
      countries: [],
      flag: 0,
      cartItem: [],
      cartid: "",
      menu: "product",

      contactus: {
        email: "",
        message: "",
      },
      //log
      userAgent: "",
      duration: "",
      logList: [],
      //edit p
      pInfoToggle: false,
      edit: {
        fname: "",
        lname: "",
        oldpass: "",
        newpass: "",
        email: "",
        oldMail: "",
        cname: "",
        desc: "",
      },
      userinformation: {
        fname: "",
        lname: "",
        password: "",
        email: "",
        phone: "",
        cname: "",
        desc: "",
      },
    };
  },
  validations: {
    userinformation: {
      fname: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10),
      },
      lname: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(10),
      },
      username: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(5),
      },
      password: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(12),
      },
      email: {
        required,
        email,
      },
      phone: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(14),
      },
      cname: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20),
      },
      desc: {
        minLength: minLength(10),
        maxLength: maxLength(200),
      },
    },
  },
  methods: {
    //============================login===============================
    async handdleLogin() {
      await axios
        .post("https://localhost:5000/users/login", {
          email: this.login.email,
          pass: this.login.password,
        })
        .then((response) => {
          localStorage.setItem("fname", response.data[0].fname);
          localStorage.setItem("lname", response.data[0].lname);
          localStorage.setItem("cname", response.data[0].companyname);
          localStorage.setItem("phone", response.data[0].phone);
          localStorage.setItem("desc", response.data[0].description);
          localStorage.setItem("token", response.data[0].email);
          localStorage.setItem("userrole", response.data[0].role);
          localStorage.setItem("userid", response.data[0].id);
          localStorage.setItem("userStatus", response.data[0].status);
          localStorage.setItem("profile", response.data[0].photo);

          this.error = "";
          this.login.email = "";
          this.login.password = "";

          this.isloggedin = true; //user is logged in
          this.flag = 6; // user redirected to dashboard

          //log activity
          userService.logActivity({
            action: `${response.data[0].email} Is Logged IN`,
            duration: this.duration,
            agent: this.userAgent,
          });

          this.loggedInEmail = localStorage.getItem("token");
          this.loggedInRole = localStorage.getItem("userrole");
          this.userId = localStorage.getItem("userid");
          this.userStatus = localStorage.getItem("userStatus");
          this.profile = localStorage.getItem("profile");

          //loggedin user info
          this.edit.fname = localStorage.getItem("fname");
          this.edit.lname = localStorage.getItem("lname");
          this.edit.cname = localStorage.getItem("cname");
          this.edit.phone = localStorage.getItem("phone");
          this.edit.email = localStorage.getItem("token");
          this.edit.desc = localStorage.getItem("desc");

          if (this.loggedInRole == "admin") {
            this.isadmin = true;
          }
        })
        .catch((error) => {
          this.error = "Incorrect E-mail or Password";
          console.log(error);
        });
    },
    logout() {
      this.isloggedin = false;
      this.flag = 4; //go back to account

      //log activity
      userService.logActivity({
        action: `${localStorage.getItem("token")} Is Logged Out`,
        duration: this.duration,
        agent: this.userAgent,
      });
      //remove user info
      localStorage.removeItem("token");
      localStorage.removeItem("userrole");
      localStorage.removeItem("fname");
      localStorage.removeItem("lname");
      localStorage.removeItem("phone");
      localStorage.removeItem("desc");
      localStorage.removeItem("cname");
    },
    async resetPassword(mail) {
      await userService.resetPassword(mail);
    },
    //===============================Cart===============================
    async addToCart(id, itemname, price, usrid) {
      this.cart = this.cart + 1;
      //unique cart id for all customer
      await productservice.initCart({
        id: id,
        itemname: itemname,
        price: price,
        cartid: this.cartid,
        uid: usrid,
      });
    },
    async viewCartItem() {
      this.flag = 1;
      this.cartItem = await productservice.showCart(this.cartid);
      this.cart = this.cartItem.length;
      //total price
      this.totalPrice = await productservice.getTotalPrice(this.cartid);
    },
    async removeFromCart(id) {
      ///id
      await productservice.removeCartItem(id);
      this.cartItem = await productservice.showCart(this.cartid);
      this.cart = this.cartItem.length;
      this.totalPrice = await productservice.getTotalPrice(this.cartid);
    },
    async updateQuantity(id, itemid) {
      const val = Number(document.getElementById(id).value);
      await productservice
        .updateProductQuantity({ id, val, itemid })
        .then((response) => {
          this.viewCartItem(); //refresh cart
          this.refreshTOtal();
         
          if (response.error) {
            this.error = response.error;
          }
            
        })
        .catch((error) => {
          this.error = error;
        });
    },
    async CartProductStatus(id, num, status) {
      await productservice.itemSold({
        itemid: id,
        iquantity: num,
        status: !status,
      });
    },
      refreshTOtal() {
      this.totalPrice =  productservice.getTotalPrice(this.cartid);
    },
    async placeOrder() {
      //place order
      await productservice.placeOrder({
        order: this.order,
        cartid: this.cartid,
      });

      this.success = `Thank You ${this.order.fullname}, Your Order will Soon Delivered To You`;
      this.order = "";
    },
    async NotSold(iname, iquantity, state, id) {
      await productservice.cartItemStatus({
        iname: iname,
        iquantity: iquantity,
        state: state,
        id: id,
      });

      this.soldproducts = await productservice.getSoldItems(this.userId);
    },
    async showDetail(code) {
      this.modalData = await productservice.getSingleProduct(code);
      this.flag = 2; //goto detail
    },
    exportTable() {
      TableExport(document.getElementsByTagName("table"), {
        filename: "Sold Products",
      });
    },
    showsuccess() {
      this.success = "Item Updated Successfully";
    },
    async likes(id) {
      await productservice.likeProduct(id);
      this.isdislike = true;
    },
    async dislike(id) {
      await productservice.dislikeProduct(id);
      this.isdislike = false;
    },
    liked() {
      this.flag = 8;
    },
    checkout() {
      this.flag = 3; //goto checkout
    },
    Gotohome() {
      this.flag = 0; //goto home
    },
    goTocontactus() {
      this.error = "";
      this.success = "";
      this.flag = 7; // contact us
    },
    blog() {
      this.error = "";
      this.success = "";
      this.flag = 10; //blog
    },
    updateProfile() {
      this.error = "";
      this.success = "";
      this.flag = 11; //edit profile
    },
    async editprofile() {
      this.edit.oldMail = this.loggedInEmail;
      await userService
        .updateInformation(this.edit)
        .then((response) => {
          if (response.success) {
            this.error = "";
            this.success = response.success;
            //log activity
            userService.logActivity({
              action: `User information of e-mail " ${this.loggedInEmail} " updated `,
              duration: this.duration,
              agent: this.userAgent,
            });
          } else if (response.error) {
            this.success = "";
            this.error = response.error;
          } else {
            //do nothing
          }
        })
        .catch((error) => {
          this.error = error;
        });
    },
    togglePinfo() {
      this.togglePinfo = !this.togglePinfo;
    },
    account() {
      this.success = "";
      this.error = "";
      this.flag = 4; //goto account
    },
    forgotPass() {
      this.flag = 9;
    },
    log() {
      this.menu = "log";
    },
    async feedback() {
      this.flag = 6; // go to dashboard
      this.menu = "feedback";
      this.chats = await userService.getFeedback(this.loggedInEmail);
    },

    sendFeedback(value) {
      if (this.loggedInRole == "admin") {
        userService.sendFeedbacks({
          message: value,
          email: this.loggedInEmail,
          uid: this.userId,
          to: this.to,
        });
      } else {
        userService.sendFeedbacks({
          message: value,
          email: this.loggedInEmail,
          uid: this.userId,
          to: this.adminuser[0].email,
        });
      }
      this.mymessage = "";
      setInterval(this.scrollBottom, 1000);
      this.feedback();
    },
    async viewChat(email, fname, lname, cname, pic) {
      this.chats = "";
      this.chats = await userService.getFeedback(email);
      this.currentChat = fname + " " + lname;
      this.to = email;
      this.org = cname;
      this.pic = pic;
    },
    scrollBottom() {
      var element = document.getElementById("chats");
      element.scrollTop = element.scrollHeight;
    },
    gotoRegister() {
      this.success = "";
      this.error = "";
      this.flag = 5; //goto registration
    },
    async goTodashboard() {
      this.flag = 6; // go to dashboard
      localStorage.removeItem("userStatus");
      var status = await userService.getStatus(this.userId);
      //update status
      localStorage.setItem("userStatus", status[0].status);
      this.userStatus = localStorage.getItem("userStaus");
      if (this.loggedInRole == "admin") {
        this.products = await productservice.getAllProducts();
      } else {
        this.products = await productservice.getProducts(this.userId);
      }
      this.count = this.products.length;
      this.menu = "product";
    },

    async register() {
      await userService
        .registerUser(this.userinformation)
        .then((response) => {
          if (response.affectedRows) {
            this.error = "";
            this.iserror = false;
            // clear registration fields
            this.success = `Welcome ${this.userinformation.fname},Thank you for registering`;
            document.getElementById("rgfname").value = "";

            //log activity
            userService.logActivity({
              action: `New User ${this.userinformation.fname} registered`,
              duration: this.duration,
              agent: this.userAgent,
            });
          } else if (response.error) {
            this.iserror = true;
            this.error = response.error;
          } else {
            this.iserror = true;
            this.error = response.error + "or  check your internet";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //============================Refresh Dashboard=================================

    referesh() {
      this.flag = 6;
      if (this.loggedInRole == "admin" && this.menu == "product") {
        this.menu = "product";
      } else if (this.loggedInRole == "admin" && this.menu == "dealer") {
        this.menu == "dealer";
      } else if (this.loggedInRole == "admin" && this.menu == "log") {
        this.menu == "log";
      } else if (this.loggedInRole != "admin" && this.menu == "product") {
        this.menu == "product";
      } else if (this.loggedInRole != "admin" && this.menu == "cart") {
        this.menu == "cart";
      } else {
        this.menu = "product";
        this.count = this.products.length;
      }
    },
    async showProductForm() {
      this.menu = "productForm";
    },
    async showProducts() {
      this.searchvalue = "";
      this.count = this.products.length;
      this.menu = "product";
    },
    async homeSearch(value) {
      this.productList = await productservice.search(value);
      this.count = this.productList.length;
    },
    async searchProducts(value) {
      //admin search
      if (this.menu == "product" && this.loggedInRole == "admin") {
        this.products = await productservice.adminProductSearch(value);
        this.count = this.products.length;
      } else if (this.menu == "dealer" && this.loggedInRole == "admin") {
        this.userList = await userService.searchDealer(value);
        this.count = this.userList.length;
      } else if (this.menu == "cart") {
        this.soldproducts = await productservice.searchFromCart(
          this.userId,
          value
        );
        this.count = this.soldproducts.length;
      } else if (this.menu == "product") {
        this.products = await productservice.dealerProductSearch(
          this.userId,
          value
        );
        this.count = this.products.length;
      } else if (this.menu == "log") {
        this.logList = await userService.searchLog(value);
        this.count = this.logList.length;
      } else {
        this.menu = "home";
      }
    },
    async postNotice() {
      try {
        await userService.postNotice({
          title: this.title,
          mBody: this.mBody,
        }).then((response)=>{
           if(response.success){
             this.success = response.success
           }else if(response.error){
             this.error = response.error
           }else{console.log("")}
        })

        //log activity
        userService.logActivity({
          action: `new notice " ${this.title} " posted`,
          duration: this.duration,
          agent: this.userAgent,
        });

        this.title = "";
        this.mBody = "";
        this.noticeList = await userService.showNotice();
      } catch (error) {
         this.error = error
      }
    },
    async deletenotice(id) {
      await userService.deleteNotice(id).then((response) => {
        if (response.success) {
          this.success = response.success;
        }
      });
      userService.logActivity({
        action: `Notice id " ${id} " Deleted`,
        duration: this.duration,
        agent: this.userAgent,
      });
      this.noticeList = await userService.showNotice();
    },
    async showSingle(name) {
      this.productList = await userService.getSingleDealer(name);
      this.count = this.productList.length;
    },
    async sortByYear(year) {
      this.productList = await productservice.getProductByYear(year);
    },
    async sortByCountry(country) {
      this.productList = await productservice.getProductByCountry(country);
    },
    async OpenModal(code) {
      this.modalData = await productservice.getSingleProduct(code);
    },
    async updateProduct(id) {
      this.modalProductUpdate = await productservice.getProductToupdate(id);
    },
    productStatus(id, state) {
      swal({
        title: "Are you sure",
        text: "wuould you like to chnage status of this product?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          productservice.toogleProductStatus({ id, state });
          swal(" product status  changed successfully", {
            icon: "success",
          });
        }
      });
    },
    deleteProduct(pid) {
      swal({
        title: "Are you sure?",
        text: "wuould you like to delete this product?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          productservice.deleteProduct(pid);

          //log activity
          userService.logActivity({
            action: `Product with id of " ${pid} " Deleted`,
            duration: this.duration,
            agent: this.userAgent,
          });
          swal(" Product deleted successfully", {
            icon: "success",
          });
        }
      });
    },
    clearOrder() {
      this.order = "";
    },
    //clear product form
    clearField() {
      document.getElementById("iname").value = "";
      document.getElementById("icode").value = "";
      document.getElementById("model").value = "";
      document.getElementById("price").value = "";
      document.getElementById("country").value = "";
      document.getElementById("year").value = "";
      document.getElementById("make").value = "";
      document.getElementById("image").value = "";
      document.getElementById("desc").value = "";
      document.getElementById("dealer").value = "";
      document.getElementById("quantity").value = "";
    },
    realodpage() {
      this.flag = 0;
    },
    //=====================================cart=================================
    showCart() {
      this.searchvalue = "";
      this.menu = "cart";
      this.count = this.soldproducts.length;
    },
    //=====================================notification==============================
    async readNotifications() {
      await userService.readMessages();
    },
    // ====================================Comment===================================
    async registerComment() {
      await userService
        .registerComments({
          email: this.contactus.email,
          message: this.contactus.message,
        })
        .then((response) => {
          if (response.affectedRows) {
            this.error = "";
            this.iserror = false;
            // clear fields
            this.contactus = "";
          } else if (response.error) {
            this.iserror = true;
            this.error = response.error;
          } else {
            this.iserror = true;
            this.error = response.error + "or  check your internet";
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //=============================dealer==============================================
    async showDealer() {
      this.menu = "dealer";
      this.userList = await userService.getAllDealers();
      this.count = this.userList.length;
    },
    // activate or deactivate users
    editStatus(id, state) {
      swal({
        title: "Are you sure",
        text: "wuould you like to chnage status of this user?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          userService.editStatus({ id, state });
          swal(" User Status  Chnaged successfully", {
            icon: "success",
          });
        }
      });
    },
    remove(id) {
      swal({
        title: "Are you sure?",
        text: "wuould you like to delete this user?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          userService.deleteUser(id);
          //log activity
          userService.logActivity({
            action: `User(dealer) with id of" ${id} " Deleted`,
            duration: this.duration,
            agent: this.userAgent,
          });
          swal(" User deleted successfully", {
            icon: "success",
          });
        }
      });
    },
  },
  async mounted() {
    const email = localStorage.getItem("token");
    if (email) {
      //user is already logged in
      this.loggedInEmail = localStorage.getItem("token");
      this.loggedInRole = localStorage.getItem("userrole");
      this.userId = localStorage.getItem("userid");
      this.userStatus = localStorage.getItem("userStatus");
      this.profile = localStorage.getItem("profile");
      this.edit.fname = localStorage.getItem("fname");
      this.edit.lname = localStorage.getItem("lname");
      this.edit.email = localStorage.getItem("token");
      this.edit.cname = localStorage.getItem("cname");
      this.edit.phone = localStorage.getItem("phone");
      this.edit.desc = localStorage.getItem("desc");

      this.isloggedin = true;
      if (this.loggedInRole == "admin") {
        this.isadmin = true;
      }
      this.soldproducts = await productservice.getSoldItems(this.userId);
      this.flag = 0;
      // get feedbacks

      if (this.loggedInRole == "admin") {
        this.currentChat = "";
      }
    }
    this.likedProduct = await productservice.getLikes();
  },
  async created() {
    try {
      //unique cart id for every user(device id)
      this.cartid = window.navigator.userAgent.replace(/\D+/g, "");
      //get all products home page
      this.productList = await productservice.getAllProducts();
      this.count = this.productList.length;

      this.relatedProductList = await productservice.relatedProducts();
      //get manufactured year
      this.years = await productservice.getYear();

      //get dealers city /location
      this.countries = await productservice.getallCountries();

      //get all dealers admin
      this.dealers = await userService.getAllDealers();

      //count message
      this.messages = await userService.getContactNewMessages();
      this.mcount = this.messages.length;
      this.adminuser = await userService.getadmin();
      this.noticeList = await userService.showNotice();
      this.logList = await userService.getLogs();

      this.userAgent = window.navigator.userAgent;
      //get current date & time
      var timeElapsed = Date.now();
      var today = new Date(timeElapsed);
      this.duration = today.toUTCString();
    } catch (error) {
      this.error = error.message;
    }
  },
};
</script>
<style scoped>
#chats p {
  position: relative;
  max-width: 500px;
  background-color: #fff;
  padding: 1.125em 1.5em;
  font-size: 12px;
  margin-left: 10px;
  border-radius: 1rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.3),
    0 0.0625rem 0.125rem rgba(0, 0, 0, 0.2);
}
#chats p:hover {
  background-color: lightyellow;
  color: #000;
}
#chats p::before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  bottom: 100%;
  left: 1.5em;
  border: 0.75rem solid transparent;
  border-top: none;
  border-bottom-color: #fff;
  filter: drop-shadow(0 -0.0625rem 0.0625rem rgba(0, 0, 0, 0.1));
}

.scroll {
  height: 350px;
  overflow: hidden;
}
.scroll:hover {
  overflow-y: scroll;
  cursor: pointer;
}

#cart {
  max-height: 500px;
  overflow: hidden;
}
#table {
  max-height: 500px;
  overflow: hidden;
}
#table:hover {
  overflow-y: scroll;
}
#cart:hover {
  overflow-y: scroll;
}
#users p {
  font-size: 12px;
  text-transform: capitalize;
  margin-left: 20px;
}
#users p:hover {
  color: orange;
  cursor: pointer;
}
#users {
  max-height: 350px;
  overflow: hidden;
}
#users:hover {
  overflow-y: scroll;
}
#chattxt {
  position: relative;
}
input,
button,
textarea,
select {
  border-radius: 6px;
}
.updateproduct input {
  margin: 10px;
}
#res {
  margin-left: 200px;
  text-decoration: none;
}
#dash a {
  color: black;
}
</style>
